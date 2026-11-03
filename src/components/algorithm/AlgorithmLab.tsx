import { useMemo, useState } from 'react'
import './AlgorithmLab.css'

type Feedback = { type: 'success' | 'error' | 'info'; text: string } | null

type SequenceStep = {
  id: string
  text: string
}

type MissionId = 1 | 2 | 3

const roadmap = [
  ['A1', 'Algoritmaya Giriş'],
  ['A2', 'Problem Analizi'],
  ['A3', 'İyi Algoritmanın Özellikleri'],
  ['A4', 'Doğrusal Algoritmalar'],
  ['A5', 'Sözde Kod'],
  ['A6', 'Adım Adım Çalıştırıcı'],
  ['A7', 'Akış Şeması Sembolleri'],
  ['A8', 'Akış Şeması Kurucu'],
  ['A9', 'Hata Avcısı'],
  ['Final', 'Final Görevi'],
] as const

const correctSequence: SequenceStep[] = [
  { id: 'save', text: 'Ödev dosyasını kaydet.' },
  { id: 'mail', text: 'E-posta uygulamasını aç.' },
  { id: 'new', text: 'Yeni mesaj oluştur.' },
  { id: 'recipient', text: 'Alıcının adresini yaz.' },
  { id: 'attach', text: 'Ödev dosyasını mesaja ekle.' },
  { id: 'send', text: 'Gönder düğmesine bas.' },
]

const initialSequence: SequenceStep[] = [
  correctSequence[1],
  correctSequence[0],
  correctSequence[3],
  correctSequence[2],
  correctSequence[5],
  correctSequence[4],
]

const sequenceHints: Record<string, string> = {
  save: 'Göndereceğin dosyanın önce hazır ve kaydedilmiş olması gerekir.',
  new: 'Alıcı yazabilmek için önce yeni bir mesaj oluşturmalısın.',
  attach: 'Mesajı göndermeden önce ödev dosyasını eklemelisin.',
  send: 'Gönder düğmesi en son işi yapar; önce mesajın hazırlanmış olması gerekir.',
}

const missingOptions = [
  ['copy', 'Kopyala düğmesine bas.'],
  ['folder', 'Çıkan sayfayı dosyaya koy.'],
  ['shutdown', 'Bilgisayarı kapat.'],
] as const

const precisionChallenges = [
  {
    id: 'pen',
    prompt: 'Bir robota kırmızı kalemi kutuya koyduracaksın. Hangisini daha kolay uygular?',
    options: [
      ['a', 'Kalemi hallet.'],
      ['b', 'Masadaki kırmızı kalemi al ve kalem kutusuna koy.'],
    ],
    answer: 'b',
  },
  {
    id: 'water',
    prompt: 'Robotun bardağı yarıya kadar suyla doldurması gerekiyor.',
    options: [
      ['a', 'Bardağı musluğun altına koy ve yarısına kadar su doldur.'],
      ['b', 'Biraz su koy.'],
    ],
    answer: 'a',
  },
  {
    id: 'file',
    prompt: 'Robot masaüstündeki “odev.pdf” dosyasını açacak.',
    options: [
      ['a', 'Dosyayı aç.'],
      ['b', 'Masaüstündeki “odev.pdf” dosyasına çift tıkla.'],
    ],
    answer: 'b',
  },
] as const

export function AlgorithmLab() {
  const [activeMission, setActiveMission] = useState<MissionId>(1)
  const [completed, setCompleted] = useState<Record<MissionId, boolean>>({ 1: false, 2: false, 3: false })

  const [sequence, setSequence] = useState(initialSequence)
  const [sequenceFeedback, setSequenceFeedback] = useState<Feedback>(null)

  const [missingChoice, setMissingChoice] = useState('')
  const [missingFeedback, setMissingFeedback] = useState<Feedback>(null)

  const [precisionAnswers, setPrecisionAnswers] = useState<Record<string, string>>({})
  const [precisionFeedback, setPrecisionFeedback] = useState<Feedback>(null)

  const precisionScore = useMemo(
    () => precisionChallenges.reduce((score, item) => score + (precisionAnswers[item.id] === item.answer ? 1 : 0), 0),
    [precisionAnswers],
  )

  const completedCount = Object.values(completed).filter(Boolean).length
  const a1Complete = completedCount === 3

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
  }

  function completeMission(id: MissionId) {
    setCompleted((current) => ({ ...current, [id]: true }))
  }

  function checkSequence() {
    const firstWrong = sequence.findIndex((step, index) => step.id !== correctSequence[index].id)

    if (firstWrong === -1) {
      completeMission(1)
      setSequenceFeedback({
        type: 'success',
        text: 'Oldu! Mesaj gönderilebilmek için gereken işler doğru sıraya oturdu.',
      })
      return
    }

    const misplaced = sequence[firstWrong]
    const hint = sequenceHints[misplaced.id] ?? 'Bu adım yapılmadan hemen önce hangi işin tamamlanmış olması gerektiğini düşün.'
    setSequenceFeedback({ type: 'error', text: `${firstWrong + 1}. sırada bir şey ters gidiyor. ${hint}` })
  }

  function checkMissingStep() {
    if (!missingChoice) {
      setMissingFeedback({ type: 'info', text: 'Boşluğa gelecek adımı seç.' })
      return
    }

    if (missingChoice === 'copy') {
      completeMission(2)
      setMissingFeedback({
        type: 'success',
        text: 'Evet. Kâğıdı yerleştirmek tek başına yetmez; makineye kopyalama işlemini başlatmasını söylemek gerekiyor.',
      })
    } else {
      setMissingFeedback({
        type: 'error',
        text: 'Bu adım boşluğu doldurmuyor. Çıktıyı alabilmek için önce makinenin hangi işlemi yapması gerekiyor?',
      })
    }
  }

  function checkPrecision() {
    const answered = precisionChallenges.filter((item) => precisionAnswers[item.id]).length

    if (answered < precisionChallenges.length) {
      setPrecisionFeedback({ type: 'info', text: 'Üç robot kartını da tamamla.' })
      return
    }

    if (precisionScore === precisionChallenges.length) {
      completeMission(3)
      setPrecisionFeedback({
        type: 'success',
        text: 'Robot artık ne yapacağını tahmin etmek zorunda değil. Her komut açık ve uygulanabilir.',
      })
    } else {
      setPrecisionFeedback({
        type: 'error',
        text: `${precisionScore}/3 kart net. Robotun yorum yapmak zorunda kalacağı komutları tekrar düşün.`,
      })
    }
  }

  function resetA1() {
    setActiveMission(1)
    setCompleted({ 1: false, 2: false, 3: false })
    setSequence(initialSequence)
    setSequenceFeedback(null)
    setMissingChoice('')
    setMissingFeedback(null)
    setPrecisionAnswers({})
    setPrecisionFeedback(null)
  }

  const missionUnlocked = (id: MissionId) => id === 1 || completed[(id - 1) as MissionId]

  return (
    <div className="algorithm-playground">
      <section className="playground-intro">
        <div>
          <span className="level-pill">9. sınıf seviyesi · sıfırdan başla</span>
          <h2>Bir işi bilgisayara yaptırabilecek kadar net düşünebilir misin?</h2>
          <p>Tanım ezberlemek yok. Küçük görevleri çöz, mantığı kendin yakala.</p>
        </div>
        <div className="a1-progress" aria-label={`A1 ilerleme ${completedCount}/3`}>
          <strong>{completedCount}/3</strong>
          <span>görev tamamlandı</span>
        </div>
      </section>

      <section className="roadmap-strip" aria-label="Algoritma laboratuvarı yol haritası">
        {roadmap.map(([code, title], index) => (
          <button key={code} className={index === 0 ? 'active' : ''} disabled={index !== 0} title={index === 0 ? title : `${title} · yakında`}>
            <span>{code}</span>
            <strong>{title}</strong>
            {index !== 0 && <em>🔒</em>}
          </button>
        ))}
      </section>

      <section className="mission-shell">
        <div className="mission-nav" aria-label="A1 görevleri">
          <MissionButton id={1} title="Karışıklığı çöz" subtitle="Doğru sırayı kur" active={activeMission === 1} complete={completed[1]} unlocked onClick={() => setActiveMission(1)} />
          <MissionButton id={2} title="Kayıp adımı bul" subtitle="Eksik parçayı tamamla" active={activeMission === 2} complete={completed[2]} unlocked={missionUnlocked(2)} onClick={() => setActiveMission(2)} />
          <MissionButton id={3} title="Robot bunu anlar mı?" subtitle="Komutu netleştir" active={activeMission === 3} complete={completed[3]} unlocked={missionUnlocked(3)} onClick={() => setActiveMission(3)} />
        </div>

        <div className="mission-stage">
          {activeMission === 1 && (
            <div className="mission-content">
              <div className="mission-heading">
                <span>GÖREV 1</span>
                <h3>Ödevini e-postayla göndereceksin.</h3>
                <p>Adımlar karışmış. Oklarla doğru sıraya getir.</p>
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
                <button className="primary-lab-button" onClick={checkSequence}>Kontrol et</button>
                <button className="text-lab-button" onClick={() => { setSequence(initialSequence); setSequenceFeedback(null) }}>Başa al</button>
                {completed[1] && <button className="secondary-lab-button" onClick={() => setActiveMission(2)}>Sonraki görev →</button>}
              </div>
              <FeedbackBox feedback={sequenceFeedback} />
            </div>
          )}

          {activeMission === 2 && (
            <div className="mission-content">
              <div className="mission-heading">
                <span>GÖREV 2</span>
                <h3>Fotokopi makinesi bir adımı unutmuş.</h3>
                <p>Boşluğu tamamla; yoksa makine çıktıyı üretemez.</p>
              </div>

              <div className="missing-flow">
                <FlowStep number="1" text="Belgeyi tarayıcı camına yerleştir." />
                <FlowArrow />
                <FlowStep number="2" text="Kapağı kapat." />
                <FlowArrow />
                <div className="missing-slot">?</div>
                <FlowArrow />
                <FlowStep number="4" text="Çıkan kopyayı al." />
              </div>

              <div className="missing-options">
                {missingOptions.map(([value, label]) => (
                  <button key={value} className={missingChoice === value ? 'selected' : ''} onClick={() => { setMissingChoice(value); setMissingFeedback(null) }}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="stage-actions">
                <button className="primary-lab-button" onClick={checkMissingStep}>Boşluğu tamamla</button>
                {completed[2] && <button className="secondary-lab-button" onClick={() => setActiveMission(3)}>Sonraki görev →</button>}
              </div>
              <FeedbackBox feedback={missingFeedback} />
            </div>
          )}

          {activeMission === 3 && (
            <div className="mission-content">
              <div className="mission-heading">
                <span>GÖREV 3</span>
                <h3>Robot yalnızca söylediğini yapar.</h3>
                <p>Her kartta robotun tahmin yürütmeden uygulayabileceği komutu seç.</p>
              </div>

              <div className="precision-grid">
                {precisionChallenges.map((item, index) => (
                  <fieldset key={item.id}>
                    <legend><span>{index + 1}</span>{item.prompt}</legend>
                    {item.options.map(([value, label]) => (
                      <label key={value} className={precisionAnswers[item.id] === value ? 'selected' : ''}>
                        <input
                          type="radio"
                          name={item.id}
                          value={value}
                          checked={precisionAnswers[item.id] === value}
                          onChange={() => { setPrecisionAnswers((current) => ({ ...current, [item.id]: value })); setPrecisionFeedback(null) }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>

              <div className="stage-actions">
                <button className="primary-lab-button" onClick={checkPrecision}>Robotları çalıştır</button>
              </div>
              <FeedbackBox feedback={precisionFeedback} />
            </div>
          )}
        </div>
      </section>

      {a1Complete && (
        <section className="discovery-card">
          <div className="discovery-icon">✓</div>
          <div>
            <span>FARK ETMEDEN NE YAPTIN?</span>
            <h3>Bir işi küçük, açık ve doğru sıralanmış adımlara böldün.</h3>
            <p>Sıra kurdun, eksik adımı fark ettin ve belirsiz komutları netleştirdin. İşte algoritmik düşünmenin başlangıcı tam olarak bu.</p>
          </div>
          <button className="text-lab-button" onClick={resetA1}>A1’i yeniden oyna</button>
        </section>
      )}
    </div>
  )
}

function MissionButton({ id, title, subtitle, active, complete, unlocked, onClick }: { id: MissionId; title: string; subtitle: string; active: boolean; complete: boolean; unlocked: boolean; onClick: () => void }) {
  return (
    <button className={`${active ? 'active' : ''} ${complete ? 'complete' : ''}`} onClick={onClick} disabled={!unlocked}>
      <b>{complete ? '✓' : id}</b>
      <span><strong>{title}</strong><small>{unlocked ? subtitle : 'Önceki görevi tamamla'}</small></span>
    </button>
  )
}

function FlowStep({ number, text }: { number: string; text: string }) {
  return <div className="flow-step"><b>{number}</b><span>{text}</span></div>
}

function FlowArrow() {
  return <div className="flow-arrow">↓</div>
}

function FeedbackBox({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  return <div className={`lab-feedback ${feedback.type}`}>{feedback.text}</div>
}
