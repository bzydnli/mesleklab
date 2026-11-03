import { useMemo, useState } from 'react'
import {
  algorithmModules,
  algorithmScopeNote,
  getAlgorithmModule,
  type AlgorithmModuleId,
} from '../../data/algorithmCurriculum'
import './AlgorithmLab.css'

type Feedback = { type: 'success' | 'error' | 'info'; text: string } | null

type SequenceStep = {
  id: string
  text: string
}

const correctSequence: SequenceStep[] = [
  { id: 'materials', text: 'Ekmek, peynir ve diğer malzemeleri hazırla.' },
  { id: 'bread', text: 'Ekmeği aç ve çalışma alanına koy.' },
  { id: 'fill', text: 'Malzemeleri ekmeğin arasına yerleştir.' },
  { id: 'machine', text: 'Tost makinesini çalıştır.' },
  { id: 'place', text: 'Hazırladığın tostu makineye yerleştir.' },
  { id: 'cook', text: 'Tost pişene kadar bekle.' },
  { id: 'serve', text: 'Tostu çıkar ve servis et.' },
]

const initialSequence: SequenceStep[] = [
  correctSequence[0],
  correctSequence[2],
  correctSequence[1],
  correctSequence[4],
  correctSequence[3],
  correctSequence[6],
  correctSequence[5],
]

const sequenceHints: Record<string, string> = {
  bread: 'Malzemeyi ekmeğin arasına koyabilmek için önce ekmeği hazırlaman gerekir.',
  machine: 'Tostu makineye yerleştirmeden önce makinenin kullanıma hazır olması gerekir.',
  cook: 'Servis etmeden önce tostun pişmiş olması gerekir.',
}

const quiz = [
  {
    id: 'definition',
    question: 'Algoritma en iyi hangi ifadeyle açıklanır?',
    options: [
      ['a', 'Bilgisayarda yazılan her kod parçası'],
      ['b', 'Bir problemi çözmek için izlenen açık ve sıralı adımlar'],
      ['c', 'Sadece matematik problemlerinde kullanılan formül'],
    ],
    answer: 'b',
  },
  {
    id: 'order',
    question: 'Adımların sırası neden önemlidir?',
    options: [
      ['a', 'Algoritmayı daha uzun göstermek için'],
      ['b', 'Bazı adımların çalışabilmesi için önce gerekli bilginin veya işlemin tamamlanması gerektiği için'],
      ['c', 'Her algoritma aynı sırayı kullandığı için'],
    ],
    answer: 'b',
  },
  {
    id: 'clarity',
    question: 'Hangisi bilgisayar için daha belirsiz bir adımdır?',
    options: [
      ['a', 'İki sayıyı topla.'],
      ['b', 'Sonucu ekrana yaz.'],
      ['c', 'Biraz işlem yap ve sonucu bul.'],
    ],
    answer: 'c',
  },
]

export function AlgorithmLab() {
  const [moduleId, setModuleId] = useState<AlgorithmModuleId>('A1')
  const [sequence, setSequence] = useState(initialSequence)
  const [sequenceFeedback, setSequenceFeedback] = useState<Feedback>(null)
  const [sequencePassed, setSequencePassed] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizFeedback, setQuizFeedback] = useState<Feedback>(null)
  const selectedModule = getAlgorithmModule(moduleId) ?? algorithmModules[0]

  const quizScore = useMemo(
    () => quiz.reduce((score, item) => score + (quizAnswers[item.id] === item.answer ? 1 : 0), 0),
    [quizAnswers],
  )
  const a1Complete = sequencePassed && quizScore >= 2

  function chooseModule(id: AlgorithmModuleId) {
    setModuleId(id)
    requestAnimationFrame(() => document.getElementById('module-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= sequence.length) return
    setSequence((current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
    setSequenceFeedback(null)
    setSequencePassed(false)
  }

  function checkSequence() {
    const firstWrong = sequence.findIndex((step, index) => step.id !== correctSequence[index].id)
    if (firstWrong === -1) {
      setSequencePassed(true)
      setSequenceFeedback({
        type: 'success',
        text: 'Doğru sıra. Her adım, ihtiyaç duyduğu önceki adım tamamlandıktan sonra geliyor. İşte algoritmik düşünmenin ilk çekirdeği bu.',
      })
      return
    }

    const misplaced = sequence[firstWrong]
    const hint = sequenceHints[misplaced.id] ?? 'Bu adımın ihtiyaç duyduğu bir önceki işi düşün. Önce hangi hazırlığın tamamlanmış olması gerekir?'
    setSequenceFeedback({ type: 'error', text: `${firstWrong + 1}. adımda sıra bozuluyor. İpucu: ${hint}` })
  }

  function checkQuiz() {
    const answered = quiz.filter((item) => quizAnswers[item.id]).length
    if (answered < quiz.length) {
      setQuizFeedback({ type: 'info', text: 'Üç soruyu da cevapla; sonra birlikte kontrol edelim.' })
      return
    }

    setQuizFeedback(
      quizScore >= 2
        ? { type: 'success', text: `${quizScore}/3 doğru. A1 kontrolünü geçtin.` }
        : { type: 'error', text: `${quizScore}/3 doğru. Algoritmanın “açık adımlar + doğru sıra” fikrine yeniden bakıp bir kez daha dene.` },
    )
  }

  function resetA1() {
    setSequence(initialSequence)
    setSequenceFeedback(null)
    setSequencePassed(false)
    setQuizAnswers({})
    setQuizFeedback(null)
  }

  return (
    <div className="algorithm-playground">
      <section className="algorithm-source-note">
        <div>
          <span className="meb-pill">MEB 9. SINIF</span>
          <div>
            <strong>Algoritma Laboratuvarı v1</strong>
            <p>Problem çözme ve algoritmalar öğrenme alanını küçük, etkileşimli adımlara bölüyoruz.</p>
          </div>
        </div>
        <span className="roadmap-count">A1–A9 + Final</span>
      </section>

      <section className="roadmap-section">
        <div className="section-copy">
          <span className="panel-kicker">KİLİTLENEN YOL HARİTASI</span>
          <h2>Önce düşünme biçimi, sonra gösterim.</h2>
          <p>A1’den başlayıp her modülde aynı öğrenme motorunu kullanacağız: Öğren → Dene → Neden oldu? → Görev → Ustalaştın mı?</p>
        </div>

        <div className="module-roadmap" aria-label="Algoritma laboratuvarı modülleri">
          {algorithmModules.map((module, index) => (
            <button
              key={module.id}
              className={`roadmap-card ${module.id === moduleId ? 'active' : ''} ${module.status === 'live' ? 'live' : ''}`}
              onClick={() => chooseModule(module.id)}
            >
              <span className="roadmap-index">{index + 1}</span>
              <span className="roadmap-code">{module.id}</span>
              <strong>{module.title}</strong>
              <small>{module.eyebrow}</small>
              <em>{module.status === 'live' ? 'CANLI' : 'İÇERİK HAZIR'}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="scope-note">
        <strong>v1 kapsam sınırı</strong>
        <p>{algorithmScopeNote}</p>
      </section>

      <section className="module-detail" id="module-detail">
        <div className="module-detail-heading">
          <div>
            <span className="module-code-badge">{selectedModule.id}</span>
            <span className="panel-kicker">İÇERİK ENVANTERİ</span>
          </div>
          <h2>{selectedModule.title}</h2>
          <p>{selectedModule.eyebrow}</p>
        </div>

        <div className="inventory-grid">
          <article className="inventory-card inventory-wide">
            <span>1 · KONU ANLATIMI</span>
            <p>{selectedModule.lesson}</p>
          </article>
          <article className="inventory-card inventory-wide">
            <span>2 · PLAYGROUND NE YAPACAK?</span>
            <p>{selectedModule.playground}</p>
          </article>
          <article className="inventory-card">
            <span>3 · SORU / ALGORİTMA BANKASI</span>
            <ol>{selectedModule.exercises.map((exercise) => <li key={exercise}>{exercise}</li>)}</ol>
          </article>
          <article className="inventory-card">
            <span>4 · BAŞARI KRİTERİ</span>
            <ul>{selectedModule.successCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
          </article>
        </div>
      </section>

      {moduleId === 'A1' ? (
        <section className="live-lab-section">
          <div className="live-lab-heading">
            <div>
              <span className="live-dot"></span>
              <span className="panel-kicker">A1 CANLI PLAYGROUND</span>
            </div>
            <h2>Algoritmayı önce günlük hayatta yakala.</h2>
            <p>Kod yok. Önce sadece “hangi adım, neden önce?” sorusuna odaklanıyoruz.</p>
          </div>

          <div className="concept-strip">
            <Concept label="Problem" text="Çözmek istediğimiz durum" />
            <Concept label="Çözüm" text="Problemi ortadan kaldıran yol" />
            <Concept label="Adım" text="Çözüm yolundaki tek işlem" />
            <Concept label="Sıra" text="Adımların mantıklı ilerleyişi" />
            <Concept label="Algoritma" text="Açık ve sıralı çözüm adımları" />
          </div>

          <div className="a1-workbench">
            <div className="sequence-panel">
              <div className="panel-heading">
                <span className="panel-kicker">DENE · TOST ALGORİTMASI</span>
                <h3>Karışık adımları doğru sıraya getir.</h3>
                <p>Okları kullan. Kontrol ettiğinde sistem yanlış sıradaki ilk bağımlılığı açıklayacak.</p>
              </div>

              <div className="sequence-list">
                {sequence.map((step, index) => (
                  <div className="sequence-step" key={step.id}>
                    <b>{index + 1}</b>
                    <span>{step.text}</span>
                    <div className="step-controls">
                      <button aria-label="Yukarı taşı" onClick={() => moveStep(index, -1)} disabled={index === 0}>↑</button>
                      <button aria-label="Aşağı taşı" onClick={() => moveStep(index, 1)} disabled={index === sequence.length - 1}>↓</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="stage-actions">
                <button className="primary-lab-button" onClick={checkSequence}>Sırayı kontrol et</button>
                <button className="text-lab-button" onClick={() => { setSequence(initialSequence); setSequenceFeedback(null); setSequencePassed(false) }}>Karıştırılmış hâle dön</button>
              </div>
              <FeedbackBox feedback={sequenceFeedback} />
            </div>

            <div className="quiz-panel">
              <div className="panel-heading">
                <span className="panel-kicker">USTALAŞTIN MI?</span>
                <h3>3 kısa kontrol sorusu</h3>
                <p>En az 2 doğru cevap A1 kontrolünü geçmek için yeterli.</p>
              </div>

              <div className="quiz-list">
                {quiz.map((item, questionIndex) => (
                  <fieldset key={item.id}>
                    <legend>{questionIndex + 1}. {item.question}</legend>
                    {item.options.map(([value, label]) => (
                      <label key={value} className={quizAnswers[item.id] === value ? 'selected' : ''}>
                        <input
                          type="radio"
                          name={item.id}
                          value={value}
                          checked={quizAnswers[item.id] === value}
                          onChange={() => { setQuizAnswers((current) => ({ ...current, [item.id]: value })); setQuizFeedback(null) }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>

              <button className="primary-lab-button full" onClick={checkQuiz}>Kontrol sorularını değerlendir</button>
              <FeedbackBox feedback={quizFeedback} />
            </div>
          </div>

          <div className={`completion-card ${a1Complete ? 'complete' : ''}`}>
            <div>
              <span>{a1Complete ? '✓' : 'A1'}</span>
              <div>
                <strong>{a1Complete ? 'A1 tamamlandı: Algoritmaya Giriş' : 'A1 başarı kapısı'}</strong>
                <p>{a1Complete ? 'Sıra bağımlılığını kurdun ve temel kavram kontrolünü geçtin. Sıradaki modül A2 Problem Analizi.' : 'Sıralama görevini doğru tamamla ve kontrol sorularında en az 2/3 yap.'}</p>
              </div>
            </div>
            {a1Complete ? (
              <button className="secondary-lab-button" onClick={() => chooseModule('A2')}>A2 envanterine geç →</button>
            ) : (
              <button className="text-lab-button" onClick={resetA1}>A1’i sıfırla</button>
            )}
          </div>
        </section>
      ) : (
        <section className="coming-next-card">
          <span>{selectedModule.id}</span>
          <div>
            <strong>Bu modülün içeriği artık kilitli.</strong>
            <p>Bir sonraki geliştirme turunda bu envanteri doğrudan etkileşimli ekrana çevireceğiz. Şimdilik canlı uygulama A1’de.</p>
          </div>
          <button className="secondary-lab-button" onClick={() => chooseModule('A1')}>A1 playground’a dön</button>
        </section>
      )}
    </div>
  )
}

function Concept({ label, text }: { label: string; text: string }) {
  return <div className="concept-card"><strong>{label}</strong><span>{text}</span></div>
}

function FeedbackBox({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  return <div className={`lab-feedback ${feedback.type}`}>{feedback.text}</div>
}
