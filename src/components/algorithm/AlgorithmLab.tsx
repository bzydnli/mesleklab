import { useMemo, useState } from 'react'
import './AlgorithmLab.css'

type Stage = 'problem' | 'algorithm' | 'flow'
type Feedback = { type: 'success' | 'error' | 'info'; text: string } | null

type AlgorithmStep = {
  id: string
  text: string
  kind: 'start' | 'input' | 'process' | 'output' | 'end'
}

const correctSteps: AlgorithmStep[] = [
  { id: 'start', text: 'Başla', kind: 'start' },
  { id: 'width', text: 'Dikdörtgenin kısa kenarını oku', kind: 'input' },
  { id: 'height', text: 'Dikdörtgenin uzun kenarını oku', kind: 'input' },
  { id: 'area', text: 'Alan = kısa kenar × uzun kenar', kind: 'process' },
  { id: 'print', text: 'Alan değerini ekrana yaz', kind: 'output' },
  { id: 'end', text: 'Bitir', kind: 'end' },
]

const initialSteps: AlgorithmStep[] = [
  correctSteps[0],
  correctSteps[2],
  correctSteps[3],
  correctSteps[1],
  correctSteps[4],
  correctSteps[5],
]

const flowRoles = [
  { id: 'startEnd', label: 'Başla / Bitir', answer: 'oval' },
  { id: 'input', label: 'Veri girişi', answer: 'parallelogram' },
  { id: 'process', label: 'İşlem / hesaplama', answer: 'rectangle' },
  { id: 'output', label: 'Çıktı', answer: 'document' },
]

const symbolOptions = [
  { value: '', label: 'Sembol seç' },
  { value: 'oval', label: 'Oval' },
  { value: 'rectangle', label: 'Dikdörtgen' },
  { value: 'parallelogram', label: 'Paralelkenar' },
  { value: 'document', label: 'Çıktı / belge' },
]

export function AlgorithmLab() {
  const [stage, setStage] = useState<Stage>('problem')
  const [analysisAnswers, setAnalysisAnswers] = useState({ input: '', process: '', output: '' })
  const [analysisFeedback, setAnalysisFeedback] = useState<Feedback>(null)
  const [steps, setSteps] = useState(initialSteps)
  const [orderFeedback, setOrderFeedback] = useState<Feedback>(null)
  const [shortSide, setShortSide] = useState(4)
  const [longSide, setLongSide] = useState(7)
  const [activeStep, setActiveStep] = useState(-1)
  const [flowAnswers, setFlowAnswers] = useState<Record<string, string>>({})
  const [flowFeedback, setFlowFeedback] = useState<Feedback>(null)

  const analysisCorrect = useMemo(
    () => analysisAnswers.input === 'kenarlar' && analysisAnswers.process === 'carpma' && analysisAnswers.output === 'alan',
    [analysisAnswers],
  )

  const orderCorrect = useMemo(
    () => steps.every((step, index) => step.id === correctSteps[index].id),
    [steps],
  )

  const area = shortSide * longSide

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= steps.length) return
    setSteps((current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
    setOrderFeedback(null)
    setActiveStep(-1)
  }

  function checkAnalysis() {
    if (analysisCorrect) {
      setAnalysisFeedback({ type: 'success', text: 'Doğru. Girdileri, yapılacak işlemi ve beklenen çıktıyı ayırdın. Algoritma yazmadan önce problemin bileşenlerini netleştirmek işimizi kolaylaştırır.' })
    } else {
      setAnalysisFeedback({ type: 'error', text: 'Bir kez daha düşün. “Elimde hangi bilgiler var?”, “Bu bilgilerle ne yapacağım?” ve “Sonuçta ne üretmeliyim?” sorularını sırayla cevapla.' })
    }
  }

  function checkOrder() {
    if (orderCorrect) {
      setOrderFeedback({ type: 'success', text: 'Algoritma doğru sırada. Girdiler alınmadan hesaplama yapılamayacağı için önce iki kenarı okumamız gerekiyor.' })
    } else {
      const firstWrong = steps.findIndex((step, index) => step.id !== correctSteps[index].id)
      setOrderFeedback({ type: 'error', text: `${firstWrong + 1}. adımda akış bozuluyor. Bir işlemin kullanacağı bilgi, o işlemden önce elde edilmiş olmalı.` })
    }
  }

  function nextRunStep() {
    setActiveStep((current) => (current >= correctSteps.length - 1 ? -1 : current + 1))
  }

  function checkFlow() {
    const correct = flowRoles.every((role) => flowAnswers[role.id] === role.answer)
    setFlowFeedback(
      correct
        ? { type: 'success', text: 'Tüm semboller doğru. Artık metinsel algoritmayı görsel bir akış şemasına dönüştürmek için temel sembolleri biliyorsun.' }
        : { type: 'error', text: 'Bazı semboller eşleşmedi. İpucu: veri girişi paralelkenarla, hesaplama dikdörtgenle gösterilir.' },
    )
  }

  const knownValues = {
    shortSide: activeStep >= 1 ? shortSide : '—',
    longSide: activeStep >= 2 ? longSide : '—',
    area: activeStep >= 3 ? area : '—',
  }

  return (
    <div className="algorithm-playground">
      <div className="algorithm-source-note">
        <div>
          <span className="meb-pill">MEB 2026 UYUMLU</span>
          <strong>Algoritmik Düşünme ve Tasarım</strong>
        </div>
        <p>Problem analizi → algoritma → akış şeması</p>
      </div>

      <nav className="algorithm-tabs" aria-label="Algoritma laboratuvarı bölümleri">
        <button className={stage === 'problem' ? 'active' : ''} onClick={() => setStage('problem')}>1. Problemi Analiz Et</button>
        <button className={stage === 'algorithm' ? 'active' : ''} onClick={() => setStage('algorithm')}>2. Algoritmayı Kur</button>
        <button className={stage === 'flow' ? 'active' : ''} onClick={() => setStage('flow')}>3. Akış Şeması</button>
      </nav>

      {stage === 'problem' && (
        <section className="algorithm-stage">
          <div className="lesson-intro">
            <span className="lesson-number">01</span>
            <div>
              <h2>Önce problemi parçalarına ayıralım.</h2>
              <p>Senaryo: Kısa ve uzun kenarı verilen bir dikdörtgenin alanını bulmak istiyoruz. Kod yazmadan önce girdiyi, işlemi ve çıktıyı ayır.</p>
            </div>
          </div>

          <div className="analysis-grid">
            <article className="analysis-card">
              <span>GİRDİ</span>
              <h3>Problemi çözmek için hangi bilgi gerekli?</h3>
              <div className="choice-group">
                <button className={analysisAnswers.input === 'kenarlar' ? 'selected' : ''} onClick={() => setAnalysisAnswers((v) => ({ ...v, input: 'kenarlar' }))}>Kısa ve uzun kenar</button>
                <button className={analysisAnswers.input === 'alan' ? 'selected' : ''} onClick={() => setAnalysisAnswers((v) => ({ ...v, input: 'alan' }))}>Alan sonucu</button>
              </div>
            </article>

            <article className="analysis-card">
              <span>İŞLEM</span>
              <h3>Girdiler üzerinde hangi işlem yapılmalı?</h3>
              <div className="choice-group">
                <button className={analysisAnswers.process === 'toplama' ? 'selected' : ''} onClick={() => setAnalysisAnswers((v) => ({ ...v, process: 'toplama' }))}>Toplama</button>
                <button className={analysisAnswers.process === 'carpma' ? 'selected' : ''} onClick={() => setAnalysisAnswers((v) => ({ ...v, process: 'carpma' }))}>Çarpma</button>
              </div>
            </article>

            <article className="analysis-card">
              <span>ÇIKTI</span>
              <h3>Algoritmanın üretmesi gereken sonuç nedir?</h3>
              <div className="choice-group">
                <button className={analysisAnswers.output === 'cevre' ? 'selected' : ''} onClick={() => setAnalysisAnswers((v) => ({ ...v, output: 'cevre' }))}>Çevre</button>
                <button className={analysisAnswers.output === 'alan' ? 'selected' : ''} onClick={() => setAnalysisAnswers((v) => ({ ...v, output: 'alan' }))}>Alan</button>
              </div>
            </article>
          </div>

          <div className="stage-actions">
            <button className="primary-lab-button" onClick={checkAnalysis}>Cevapları kontrol et</button>
            {analysisCorrect && <button className="secondary-lab-button" onClick={() => setStage('algorithm')}>Algoritmaya geç →</button>}
          </div>
          <FeedbackBox feedback={analysisFeedback} />
        </section>
      )}

      {stage === 'algorithm' && (
        <section className="algorithm-stage">
          <div className="lesson-intro">
            <span className="lesson-number">02</span>
            <div>
              <h2>Adımları mantıklı bir sıraya getir.</h2>
              <p>Bir algoritmanın adımları açık, uygulanabilir ve doğru sırada olmalı. Oklarla adımları taşı, ardından kontrol et.</p>
            </div>
          </div>

          <div className="algorithm-workbench">
            <div className="step-builder">
              {steps.map((step, index) => (
                <div className={`algorithm-step kind-${step.kind}`} key={step.id}>
                  <b>{index + 1}</b>
                  <span>{step.text}</span>
                  <div className="step-controls">
                    <button aria-label="Yukarı taşı" onClick={() => moveStep(index, -1)} disabled={index === 0}>↑</button>
                    <button aria-label="Aşağı taşı" onClick={() => moveStep(index, 1)} disabled={index === steps.length - 1}>↓</button>
                  </div>
                </div>
              ))}
              <div className="stage-actions compact">
                <button className="primary-lab-button" onClick={checkOrder}>Sıralamayı kontrol et</button>
                <button className="text-lab-button" onClick={() => { setSteps(initialSteps); setOrderFeedback(null); setActiveStep(-1) }}>Başa döndür</button>
              </div>
              <FeedbackBox feedback={orderFeedback} />
            </div>

            <div className="runner-panel">
              <span className="panel-kicker">ADIM ADIM ÇALIŞTIR</span>
              <h3>Bilgisayar bu algoritmayı nasıl görür?</h3>
              <div className="number-inputs">
                <label>Kısa kenar<input type="number" min="1" value={shortSide} onChange={(e) => { setShortSide(Number(e.target.value) || 1); setActiveStep(-1) }} /></label>
                <label>Uzun kenar<input type="number" min="1" value={longSide} onChange={(e) => { setLongSide(Number(e.target.value) || 1); setActiveStep(-1) }} /></label>
              </div>

              <div className="memory-grid">
                <div><span>kısa</span><strong>{knownValues.shortSide}</strong></div>
                <div><span>uzun</span><strong>{knownValues.longSide}</strong></div>
                <div><span>alan</span><strong>{knownValues.area}</strong></div>
              </div>

              <div className="execution-track">
                {correctSteps.map((step, index) => (
                  <div key={step.id} className={index === activeStep ? 'active' : index < activeStep ? 'done' : ''}>
                    <span>{index + 1}</span>{step.text}
                  </div>
                ))}
              </div>

              {activeStep >= 4 && <div className="program-output">Çıktı: <strong>{area}</strong></div>}
              <button className="primary-lab-button full" onClick={nextRunStep}>{activeStep >= correctSteps.length - 1 ? 'Yeniden başlat' : 'Sonraki adım →'}</button>
            </div>
          </div>
        </section>
      )}

      {stage === 'flow' && (
        <section className="algorithm-stage">
          <div className="lesson-intro">
            <span className="lesson-number">03</span>
            <div>
              <h2>Algoritmayı şekillerle ifade et.</h2>
              <p>Akış şeması, algoritmadaki işlemleri özel sembollerle görselleştirir. Her görevi doğru sembolle eşleştir.</p>
            </div>
          </div>

          <div className="flow-layout">
            <div className="flow-lesson">
              {flowRoles.map((role) => (
                <label className="flow-match-row" key={role.id}>
                  <div className={`flow-shape preview-${flowAnswers[role.id] || 'empty'}`}></div>
                  <strong>{role.label}</strong>
                  <select value={flowAnswers[role.id] || ''} onChange={(e) => setFlowAnswers((v) => ({ ...v, [role.id]: e.target.value }))}>
                    {symbolOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                  </select>
                </label>
              ))}
              <div className="stage-actions compact">
                <button className="primary-lab-button" onClick={checkFlow}>Sembolleri kontrol et</button>
              </div>
              <FeedbackBox feedback={flowFeedback} />
            </div>

            <div className="flow-preview-card">
              <span className="panel-kicker">ÖRNEK AKIŞ</span>
              <h3>Dikdörtgen alanı</h3>
              <div className="flow-diagram">
                <FlowNode kind="oval" text="Başla" />
                <FlowArrow />
                <FlowNode kind="parallelogram" text="Kısa, uzun kenarı oku" />
                <FlowArrow />
                <FlowNode kind="rectangle" text="Alan = kısa × uzun" />
                <FlowArrow />
                <FlowNode kind="document" text="Alanı yaz" />
                <FlowArrow />
                <FlowNode kind="oval" text="Bitir" />
              </div>
            </div>
          </div>

          <div className="meb-learning-note">
            <strong>Neden böyle öğreniyoruz?</strong>
            <p>2026 Programlama Temelleri programında bu modülün hedefi, bir problem senaryosu üzerinde algoritmik düşünme sürecini yapılandırmak ve çözüm algoritması için akış şeması hazırlayabilmek.</p>
          </div>
        </section>
      )}
    </div>
  )
}

function FeedbackBox({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  return <div className={`lab-feedback ${feedback.type}`}>{feedback.text}</div>
}

function FlowNode({ kind, text }: { kind: 'oval' | 'parallelogram' | 'rectangle' | 'document'; text: string }) {
  return <div className={`flow-node flow-${kind}`}>{text}</div>
}

function FlowArrow() {
  return <div className="flow-arrow">↓</div>
}
