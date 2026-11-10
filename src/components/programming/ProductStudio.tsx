import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { studioChapters, type StudioChapter } from './studioData'
import { studioSandboxDocument } from './studioSandbox'
import './ProductStudio.css'

type Execution = { ok: boolean; value?: unknown; error?: string }
type SandboxResult = {
  kind: 'done' | 'error'
  outputs?: Execution[]
  preview?: Execution
  error?: string
}
type StudioCheck = {
  label: string
  passed: boolean
  expected: string
  actual: string
  hint: string
}
type StudioFeedback = { checks: StudioCheck[]; preview: Execution }

const CODE_KEY = 'mesleklab-studio-codes-v1'
const PROGRESS_KEY = 'mesleklab-studio-completed-v1'

function loadCodes(): Record<string, string> {
  const initial = Object.fromEntries(studioChapters.map((chapter) => [chapter.id, chapter.starter]))
  try {
    const saved = JSON.parse(window.localStorage.getItem(CODE_KEY) || '{}') as Record<string, unknown>
    for (const chapter of studioChapters) {
      if (typeof saved[chapter.id] === 'string') initial[chapter.id] = (saved[chapter.id] as string).slice(0, 18000)
    }
  } catch { /* Depolama kapalıysa başlangıç kodları kullanılır. */ }
  return initial
}

function loadProgress(): Record<string, boolean> {
  const initial: Record<string, boolean> = {}
  try {
    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || '{}') as Record<string, unknown>
    for (const chapter of studioChapters) initial[chapter.id] = saved[chapter.id] === true
  } catch { /* Depolama kapalı olabilir. */ }
  return initial
}

function stableValue(input: unknown): string {
  if (input === undefined) return 'undefined'
  if (typeof input === 'number' && !Number.isFinite(input)) return String(input)
  if (Array.isArray(input)) return '[' + input.map(stableValue).join(',') + ']'
  if (input && typeof input === 'object') {
    return '{' + Object.entries(input as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => JSON.stringify(key) + ':' + stableValue(value)).join(',') + '}'
  }
  return JSON.stringify(input) ?? String(input)
}

function formatHint(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`')
      ? <code key={index} className="ps-inline-code">{part.slice(1, -1)}</code>
      : part,
  )
}

function visibleValue(input: unknown): string {
  if (input === undefined) return 'Sonuç üretilmedi'
  if (typeof input === 'string') return input
  if (typeof input === 'number') return Number.isFinite(input) ? input.toLocaleString('tr-TR') : String(input)
  try { return JSON.stringify(input, null, 2) } catch { return String(input) }
}

function exampleArgs(id: string, quantity: number, student: boolean, extra: boolean): unknown[] {
  switch (id) {
    case 'fiyat': return [quantity, 150]
    case 'koltuk': return [quantity, 3]
    case 'sepet': return [[{ fiyat: 150, adet: quantity }, ...(extra ? [{ fiyat: 120, adet: 1 }] : [])]]
    case 'indirim': return [quantity * 150, student]
    case 'rezervasyon': return [{ kalan: 5, fiyat: 150 }, quantity]
    default: return []
  }
}

function ChapterNav({ active, completed, onSelect }: {
  active: number
  completed: Record<string, boolean>
  onSelect: (index: number) => void
}) {
  return <nav className="ps-chapters" aria-label="Ürün geliştirme aşamaları">
    {studioChapters.map((chapter, index) =>
      <button key={chapter.id} type="button" onClick={() => onSelect(index)}
        className={'ps-chapter ' + (index === active ? 'is-active ' : '') + (completed[chapter.id] ? 'is-done' : '')}
        aria-current={index === active ? 'step' : undefined}>
        <span className="ps-chapter-no">{completed[chapter.id] ? '✓' : String(index + 1).padStart(2, '0')}</span>
        <span className="ps-chapter-content"><small>{chapter.eyebrow.split('·')[1]?.trim()}</small><strong>{chapter.title}</strong></span>
      </button>)}
  </nav>
}

function StudioPreview({ chapter, quantity, setQuantity, student, setStudent, extra, setExtra, preview, tested }: {
  chapter: StudioChapter
  quantity: number
  setQuantity: (value: number) => void
  student: boolean
  setStudent: (value: boolean) => void
  extra: boolean
  setExtra: (value: boolean) => void
  preview: Execution | null
  tested: boolean
}) {
  const result = preview?.ok ? preview.value : undefined
  const status = chapter.id === 'koltuk' ? result :
    chapter.id === 'rezervasyon' && result && typeof result === 'object' ?
      (result as Record<string, unknown>).basarili ? 'Rezervasyon alındı' : 'Rezervasyon reddedildi' : null
  const isPositive = status === 'Onaylandı' || status === 'Rezervasyon alındı'
  const numerical = typeof result === 'number' && Number.isFinite(result) ? result : null
  const reservation = chapter.id === 'rezervasyon' && result && typeof result === 'object'
    ? result as Record<string, unknown> : null

  return <section className="ps-preview-panel">
    <header className="ps-preview-heading">
      <div><span className="ps-live-dot"/><span>CANLI UYGULAMA</span></div>
      <small>Sağdaki ekran, soldaki kodun sonucunu gösterir</small>
    </header>

    <div className="ps-app">
      <div className="ps-app-toolbar">
        <div className="ps-app-logo"><span>✳</span> biletly<span className="ps-app-logo-dot">.</span></div>
        <div className="ps-app-toplinks"><span>Keşfet</span><span>Etkinlikler</span><b>☻</b></div>
      </div>

      <div className="ps-app-banner">
        <div className="ps-banner-orb one"/>
        <div className="ps-banner-orb two"/>
        <div className="ps-banner-grid"/>
        <div className="ps-banner-copy"><small>BU HAFTANIN ETKİNLİĞİ</small>
          <h3>NOVA<br/>LIVE <em>✳</em></h3>
          <p>Müziğin ve teknolojinin buluştuğu gece.</p>
          <span>14 KASIM · 20.00 · SAHNE 01</span>
        </div>
        <div className="ps-banner-stamp">★<small>CANLI<br/>ETKİNLİK</small></div>
      </div>

      <div className="ps-product-details">
        <div className="ps-product-title"><div><small>ETKİNLİK BİLETİ</small><h4>NOVA Live Deneyimi</h4></div>
          <span className="ps-ticket-price">150 ₺ <small>/ bilet</small></span></div>
        <div className="ps-product-tags"><span>◉ İstanbul</span><span>▣ Konser</span><span>✦ Kontenjanlı</span></div>

        <div className="ps-app-field">
          <div><strong>Kaç bilet alınacak?</strong><small>Farklı değerleri dene</small></div>
          <div className="ps-counter"><button type="button" onClick={() => setQuantity(Math.max(0, quantity - 1))}
            aria-label="Bilet sayısını azalt">−</button><strong>{quantity}</strong>
            <button type="button" onClick={() => setQuantity(Math.min(12, quantity + 1))}
              aria-label="Bilet sayısını artır">+</button></div>
        </div>

        {chapter.id === 'koltuk' &&
          <div className="ps-context-strip"><span>💺</span><strong>Şu an 3 koltuk kaldı</strong><small>Talebini değiştir, tekrar çalıştır</small></div>}

        {chapter.id === 'sepet' && <>
          <div className="ps-cart-row"><span className="ps-cart-cover">🎵</span><div><strong>NOVA Live</strong><small>{quantity} × 150 ₺</small></div><b>{quantity * 150} ₺</b></div>
          {extra && <div className="ps-cart-row"><span className="ps-cart-cover second">🎨</span><div><strong>Tasarım Günü</strong><small>1 × 120 ₺</small></div><b>120 ₺</b></div>}
          <button type="button" className="ps-secondary-product-action" onClick={() => setExtra(!extra)}>
            {extra ? '− İkinci etkinliği çıkar' : '+ Sepete farklı bir etkinlik ekle'}
          </button>
        </>}

        {chapter.id === 'indirim' && <label className="ps-student-toggle"><input type="checkbox" checked={student}
          onChange={(e) => setStudent(e.target.checked)}/><span>🎓 Öğrenci indirimi uygula</span><small>%20 indirim</small></label>}

        {chapter.id === 'rezervasyon' &&
          <div className="ps-seat-visual"><div><span>BOŞ KOLTUKLAR</span><strong>{reservation && typeof reservation.kalan === 'number' ? String(reservation.kalan) : '5'}</strong></div>
            <div className="ps-seats">{Array.from({ length: 8 }, (_, i) =>
              <span key={i} className={i < 3 || (reservation && typeof reservation.kalan === 'number' && i >= 3 + Math.max(0, reservation.kalan)) ? 'occupied' : ''}>▢</span>)}</div>
          </div>}

        <div className="ps-live-output" aria-live="polite">
          <div className="ps-output-label"><span>✦ UYGULAMANIN ÜRETTİĞİ SONUÇ</span>
            <small>{tested ? 'Kod çalıştırıldı' : 'Henüz çalıştırılmadı'}</small></div>
          {!tested ? <div className="ps-output-empty"><span>▶</span> Kodu çalıştırınca sonuç burada görünecek.</div> :
            !preview?.ok ? <div className="ps-output-error">⚠ {preview?.error || 'Kod sonuç üretemedi.'}</div> :
              status ? <div className={'ps-output-status ' + (isPositive ? 'approved' : 'rejected')}>
                <span>{isPositive ? '✓' : '!'}</span><strong>{String(status)}</strong>
                {reservation && <small>{String(reservation.kalan ?? '—')} koltuk kaldı · {String(reservation.tutar ?? '—')} ₺</small>}
              </div> :
              <div className="ps-output-number">
                <span>{numerical !== null ? numerical.toLocaleString('tr-TR') + ' ₺' : visibleValue(result)}</span>
                <small>{chapter.id === 'fiyat' ? 'Hesaplanan bilet tutarı' :
                  chapter.id === 'sepet' ? 'Sepetteki ürünlerin toplamı' :
                    chapter.id === 'indirim' ? 'Ödenecek tutar' : 'Programın döndürdüğü değer'}</small>
              </div>}
        </div>
        <div className="ps-app-credit">MESLEKLAB STÜDYO • ÜRÜN ÖNİZLEMESİ</div>
      </div>
    </div>
    <p className="ps-preview-footnote">Bu ekran gerçek ödeme yapmaz. Senin yazdığın kodu deneyebilmen için hazırlanmış bir uygulama simülasyonu.</p>
  </section>
}

export function ProductStudio() {
  const [active, setActive] = useState(0)
  const [codes, setCodes] = useState<Record<string, string>>(loadCodes)
  const [completed, setCompleted] = useState<Record<string, boolean>>(loadProgress)
  const [quantity, setQuantity] = useState(2)
  const [student, setStudent] = useState(true)
  const [extra, setExtra] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [runnerReady, setRunnerReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<StudioFeedback | null>(null)
  const [runError, setRunError] = useState('')
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const codeRef = useRef<HTMLTextAreaElement | null>(null)
  const requestRef = useRef(0)

  const chapter = studioChapters[active]
  const code = codes[chapter.id] ?? chapter.starter
  const completedCount = studioChapters.filter((item) => completed[item.id]).length
  const passedCount = feedback?.checks.filter((check) => check.passed).length ?? 0
  const allPassed = !!feedback && passedCount === chapter.tests.length

  useEffect(() => {
    try { window.localStorage.setItem(CODE_KEY, JSON.stringify(codes)) } catch { /* localStorage opsiyonel */ }
  }, [codes])

  useEffect(() => {
    try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed)) } catch { /* localStorage opsiyonel */ }
  }, [completed])

  useEffect(() => {
    const listen = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return
      const data = event.data as { channel?: string; kind?: string; requestId?: number; payload?: SandboxResult }
      if (data?.channel !== 'mesleklab-studio') return
      if (data.kind === 'ready') { setRunnerReady(true); return }
      if (data.kind !== 'result' || data.requestId !== requestRef.current) return

      setBusy(false)
      const payload = data.payload
      if (!payload || payload.kind === 'error' || !Array.isArray(payload.outputs)) {
        setRunError(payload?.error || 'Kod çalıştırılamadı. Tekrar dene.')
        setFeedback(null)
        return
      }
      const checks: StudioCheck[] = chapter.tests.map((test, index) => {
        const output = payload.outputs?.[index]
        return {
          label: test.label,
          passed: !!output?.ok && stableValue(output.value) === stableValue(test.expected),
          expected: visibleValue(test.expected),
          actual: output?.ok ? visibleValue(output.value) : output?.error || 'Sonuç gelmedi',
          hint: test.hint,
        }
      })
      setRunError('')
      setFeedback({ checks, preview: payload.preview ?? { ok: false, error: 'Önizleme üretilemedi.' } })
      if (checks.every((check) => check.passed)) {
        setCompleted((prev) => ({ ...prev, [chapter.id]: true }))
      }
    }
    window.addEventListener('message', listen)
    return () => window.removeEventListener('message', listen)
  }, [chapter])

  function invalidate() {
    requestRef.current++
    setBusy(false)
    setFeedback(null)
    setRunError('')
  }

  function selectChapter(index: number) {
    invalidate()
    setActive(index)
    setQuantity(index === 1 ? 4 : 2)
    setShowHint(false)
  }

  function updateCode(next: string) {
    invalidate()
    setCodes((prev) => ({ ...prev, [chapter.id]: next.slice(0, 18000) }))
  }

  function runCode() {
    if (!runnerReady || !frameRef.current?.contentWindow) {
      setRunError('Kod çalışma alanı henüz hazır değil. Sayfayı yenileyip tekrar dene.')
      return
    }
    const id = ++requestRef.current
    setFeedback(null)
    setRunError('')
    setBusy(true)
    frameRef.current.contentWindow.postMessage({
      channel: 'mesleklab-studio',
      kind: 'run',
      requestId: id,
      payload: {
        code,
        functionName: chapter.functionName,
        tests: chapter.tests.map((test) => ({ args: test.args })),
        previewArgs: exampleArgs(chapter.id, quantity, student, extra),
      },
    }, '*')
  }

  function resetCode() {
    updateCode(chapter.starter)
  }

  function onEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const target = event.currentTarget
    const start = target.selectionStart
    const end = target.selectionEnd
    updateCode(code.slice(0, start) + '  ' + code.slice(end))
    requestAnimationFrame(() => {
      if (!codeRef.current) return
      codeRef.current.selectionStart = codeRef.current.selectionEnd = start + 2
    })
  }

  return <div className="ps-studio">
    <iframe ref={frameRef} title="İzole JavaScript çalışma alanı" sandbox="allow-scripts"
      srcDoc={studioSandboxDocument} className="ps-sandbox" onLoad={() => {
        frameRef.current?.contentWindow?.postMessage({ channel: 'mesleklab-studio', kind: 'ping' }, '*')
      }}/>

    <div className="ps-intro">
      <div className="ps-intro-text"><span className="ps-eyebrow">✳ MESLEKLAB · DİJİTAL ÜRÜN STÜDYOSU</span>
        <h2>Bir fikri, çalışan bir ürüne dönüştür.</h2>
        <p>Bilet uygulamasının geliştiricisi sensin. Kodu değiştir, çalıştır, farklı durumlarda test et ve her bölümde ürününe yeni bir özellik ekle.</p>
      </div>
      <div className="ps-progress"><span>GELİŞTİRİLEN ÖZELLİKLER</span>
        <strong>{completedCount}<small> / {studioChapters.length}</small></strong>
        <div>{studioChapters.map((item) => <i key={item.id} className={completed[item.id] ? 'done' : ''}/>)}</div>
      </div>
    </div>

    <ChapterNav active={active} completed={completed} onSelect={selectChapter}/>

    <div className="ps-workspace">
      <section className="ps-workbench">
        <div className="ps-mission">
          <span className="ps-label">{chapter.eyebrow}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.story}</p>
          <div className="ps-mission-callout"><span>🎯</span><strong>{chapter.mission}</strong></div>
          <div className="ps-skill-chips"><span>{chapter.topic}</span><span>Gerçek JavaScript</span></div>
        </div>

        <div className="ps-editor">
          <div className="ps-editor-top"><div><i/><span>ticketly.js</span></div>
            <span>JAVASCRIPT</span></div>
          <div className="ps-code-area">
            <div className="ps-line-numbers" aria-hidden="true">
              {code.split('\n').map((_, index) => <span key={index}>{index + 1}</span>)}
            </div>
            <textarea ref={codeRef} value={code} onChange={(event) => updateCode(event.target.value)}
              onKeyDown={onEditorKeyDown} spellCheck={false} autoCapitalize="off" autoCorrect="off"
              aria-label={chapter.title + ' JavaScript kod editörü'}/>
          </div>
          <div className="ps-editor-bottom"><span>● Kodun tarayıcındaki yalıtılmış alanda çalıştırılır.</span><span>JS</span></div>
        </div>

        <div className="ps-editor-actions">
          <button type="button" className="ps-run-button" onClick={runCode} disabled={busy || !runnerReady}>
            {busy ? '⏳ Çalıştırılıyor...' : '▶ Kodu çalıştır ve test et'}
          </button>
          <button type="button" className="ps-reset-button" onClick={resetCode}>↻ Başlangıç kodu</button>
        </div>

        <div className="ps-hint-area">
          <button type="button" onClick={() => setShowHint(!showHint)} aria-expanded={showHint}>
            <span>💡 {showHint ? 'İpucunu gizle' : 'Takıldın mı? İpucu al'}</span>
            <span>{showHint ? '−' : '+'}</span>
          </button>
          {showHint && <p>{formatHint(chapter.hint)}</p>}
        </div>

        <div className="ps-tests-panel">
          <div className="ps-tests-title"><div><strong>🧪 Test laboratuvarı</strong>
            <small>Kodunun farklı durumlarda da çalıştığından emin ol.</small></div>
            <span className={'ps-test-count ' + (allPassed ? 'is-green' : '')}>{feedback ? passedCount + '/' + chapter.tests.length : '—/' + chapter.tests.length}</span>
          </div>
          {runError && <div className="ps-run-error" role="alert">⚠ {runError}</div>}
          <div className="ps-test-list">
            {chapter.tests.map((test, index) => {
              const check = feedback?.checks[index]
              return <div className={'ps-test ' + (check ? check.passed ? 'pass' : 'fail' : '')} key={test.label}>
                <span className="ps-test-icon">{!check ? '○' : check.passed ? '✓' : '×'}</span>
                <div><strong>{test.label}</strong>
                  {check && <small>{check.passed ? 'Doğru sonuç: ' + check.actual :
                    'Beklenen: ' + check.expected + ' · Gelen: ' + check.actual}</small>}
                  {check && !check.passed && <em>{formatHint(check.hint)}</em>}
                </div>
              </div>
            })}
          </div>
          {allPassed && <div className="ps-success" role="status"><span>🎉</span><div><strong>Bu özellik çalışıyor!</strong>
            <p>{chapter.takeaway}</p></div>
            {active < studioChapters.length - 1 && <button type="button" onClick={() => selectChapter(active + 1)}>Sonraki →</button>}
          </div>}
        </div>
      </section>

      <StudioPreview chapter={chapter} quantity={quantity}
        setQuantity={(value) => { invalidate(); setQuantity(value) }}
        student={student} setStudent={(value) => { invalidate(); setStudent(value) }}
        extra={extra} setExtra={(value) => { invalidate(); setExtra(value) }}
        preview={feedback?.preview ?? null} tested={!!feedback}/>
    </div>
    <div className="ps-studio-bottom"><span>✦</span> <strong>Deneyerek öğren.</strong> Başlangıç kodunda özellikle düzeltilmesi gereken bir sorun var. Kodu değiştirdiğinde sonucu ürün ekranında gör ve bütün testleri geçir.</div>
  </div>
}
