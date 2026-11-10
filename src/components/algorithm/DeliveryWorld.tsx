import { useEffect, useMemo, useState } from 'react'
import './DeliveryWorld.css'

type Point = { x: number; y: number }
type Step = 'pickup' | 'go' | 'deliver'
type Rules = {
  continueWork: 'stop' | 'continue'
  unready: 'wait' | 'find-ready'
  energy: 'ignore' | 'charge'
  road: 'stop' | 'detour'
  doorstep: 'cancel' | 'retry'
}
type Package = { id: string; address: string; at: Point; readyAt: number; lockedDoor?: boolean }
type Level = {
  name: string
  short: string
  icon: string
  goal: string
  story: string
  packages: Package[]
  battery: number
  roadClosed: boolean
}
type Frame = {
  point: Point
  energy: number
  carrying: string | null
  delivered: string[]
  clock: number
  message: string
  tone: 'normal' | 'warning' | 'success' | 'danger'
  focus: string | null
}
type Result = { frames: Frame[]; success: boolean; conclusion: string; hint: string }
type RuleName = keyof Rules

const depot: Point = { x: 1, y: 2 }
const charger: Point = { x: 3, y: 4 }
const closure: Point = { x: 4, y: 2 }
const W = 9
const H = 6
const startingSteps: Step[] = ['go', 'pickup', 'deliver']
const stepInfo: Record<Step, { icon: string; title: string; note: string }> = {
  pickup: { icon: '📦', title: 'Paketi depodan al', note: 'Robotun taşıyacak bir şeyi olsun' },
  go: { icon: '🛞', title: 'Adrese doğru ilerle', note: 'Paketle birlikte müşteriye git' },
  deliver: { icon: '🏠', title: 'Paketi teslim et', note: 'Müşterinin kapısına bırak' },
}
const levels: Level[] = [
  {
    name: 'İlk teslimat', short: 'Başlangıç', icon: '📦',
    goal: 'Bir paketi doğru adrese ulaştır.',
    story: 'Mahalledeki ilk sipariş hazır. Robotun işi hangi sırayla yapacağını sen belirle.',
    packages: [{ id: '101', address: 'Mavi Ev', at: { x: 7, y: 2 }, readyAt: 0 }],
    battery: 36, roadClosed: false,
  },
  {
    name: 'Yoğun saat', short: 'Sipariş kuyruğu', icon: '🗂️',
    goal: 'Üç paketin hepsini ulaştır.',
    story: 'Siparişler birikti. Üstelik biri henüz hazırlanmadı. Robot ilk paketten sonra durmamalı.',
    packages: [
      { id: '201', address: 'Mavi Ev', at: { x: 7, y: 2 }, readyAt: 17 },
      { id: '202', address: 'Sarı Ev', at: { x: 7, y: 4 }, readyAt: 0 },
      { id: '203', address: 'Yeşil Ev', at: { x: 5, y: 1 }, readyAt: 0 },
    ],
    battery: 36, roadClosed: false,
  },
  {
    name: 'Aksilik çıktı', short: 'Pil ve kapalı yol', icon: '⚡',
    goal: 'Kapalı yola ve düşük pile rağmen teslim et.',
    story: 'Ana cadde kapandı ve robotun pili az. Ona bu durumda nasıl davranacağını öğret.',
    packages: [{ id: '301', address: 'Mavi Ev', at: { x: 7, y: 2 }, readyAt: 0 }],
    battery: 6, roadClosed: true,
  },
  {
    name: 'Gerçek vardiya', short: 'Her şey değişebilir', icon: '🌆',
    goal: 'Dört teslimatı, bütün sürprizlere rağmen tamamla.',
    story: 'Bir paket gecikiyor, cadde kapalı, pil az ve bir müşterinin kapısı ilk denemede açılmıyor.',
    packages: [
      { id: '401', address: 'Mavi Ev', at: { x: 7, y: 2 }, readyAt: 20 },
      { id: '402', address: 'Sarı Ev', at: { x: 7, y: 4 }, readyAt: 0, lockedDoor: true },
      { id: '403', address: 'Yeşil Ev', at: { x: 5, y: 1 }, readyAt: 0 },
      { id: '404', address: 'Mor Ev', at: { x: 8, y: 3 }, readyAt: 0 },
    ],
    battery: 14, roadClosed: true,
  },
]

const ruleDescriptions: Array<{
  id: RuleName
  title: string
  emoji: string
  from: number
  options: Array<{ value: string; title: string }>
}> = [
  { id: 'continueWork', title: 'Bir teslimat bitince...', emoji: '🔁', from: 1,
    options: [{ value: 'stop', title: 'İşi bitir' }, { value: 'continue', title: 'Sipariş varsa devam et' }] },
  { id: 'unready', title: 'Paket hazır değilse...', emoji: '⏳', from: 1,
    options: [{ value: 'wait', title: 'Hazır olana kadar bekle' }, { value: 'find-ready', title: 'Önce hazır olanı götür' }] },
  { id: 'energy', title: 'Pil azalınca...', emoji: '🔋', from: 2,
    options: [{ value: 'ignore', title: 'Yola devam et' }, { value: 'charge', title: 'Şarja uğra' }] },
  { id: 'road', title: 'Yol kapanırsa...', emoji: '🚧', from: 2,
    options: [{ value: 'stop', title: 'Olduğun yerde kal' }, { value: 'detour', title: 'Başka sokaktan git' }] },
  { id: 'doorstep', title: 'Kapı ilk seferde açılmazsa...', emoji: '🔔', from: 3,
    options: [{ value: 'cancel', title: 'Teslimatı bırak' }, { value: 'retry', title: 'Bir kez daha dene' }] },
]
const startingRules: Rules = {
  continueWork: 'stop', unready: 'wait', energy: 'ignore', road: 'stop', doorstep: 'cancel',
}

const equal = (a: Point, b: Point) => a.x === b.x && a.y === b.y
const inside = (p: Point) => p.x >= 0 && p.x < W && p.y >= 0 && p.y < H
const neighbors = (p: Point): Point[] => [
  { x: p.x + 1, y: p.y }, { x: p.x, y: p.y + 1 },
  { x: p.x - 1, y: p.y }, { x: p.x, y: p.y - 1 },
].filter(inside)
const pointKey = (p: Point) => p.x + '-' + p.y

function nextStreet(from: Point, to: Point, blocked: boolean, detour: boolean): Point | null {
  if (equal(from, to)) return null
  if (!detour) {
    if (from.x !== to.x) return { x: from.x + Math.sign(to.x - from.x), y: from.y }
    return { x: from.x, y: from.y + Math.sign(to.y - from.y) }
  }
  const queue: Point[] = [from]
  const parents = new Map<string, Point>()
  const seen = new Set<string>([pointKey(from)])
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index]
    if (equal(current, to)) {
      let at = current
      while (true) {
        const parent = parents.get(pointKey(at))
        if (!parent) return null
        if (equal(parent, from)) return at
        at = parent
      }
    }
    for (const candidate of neighbors(current)) {
      if (blocked && equal(candidate, closure)) continue
      const key = pointKey(candidate)
      if (seen.has(key)) continue
      seen.add(key)
      parents.set(key, current)
      queue.push(candidate)
    }
  }
  return null
}

function simulate(level: Level, plan: Step[], rules: Rules): Result {
  let point = { ...depot }
  let energy = level.battery
  let clock = 0
  let carrying: string | null = null
  const delivered = new Set<string>()
  const frames: Frame[] = []
  let error = ''
  let hint = ''
  const emit = (message: string, tone: Frame['tone'] = 'normal', focus: string | null = null) => {
    frames.push({ point: { ...point }, energy, carrying, delivered: [...delivered], clock,
      message, tone, focus })
    clock++
  }
  const stop = (message: string, advice: string) => {
    error = message
    hint = advice
    emit(message, 'danger')
    return false
  }
  emit('Depo hazır. Robot senden gelecek kuralları bekliyor.', 'normal')
  function travel(destination: Point, label: string, charging = false): boolean {
    let safety = 0
    while (!equal(point, destination) && safety++ < 90) {
      if (!charging && energy <= 12 && !equal(point, charger) && rules.energy === 'charge') {
        emit('Pil azaldı. Robot şarj noktasına yöneliyor.', 'warning', 'energy')
        if (!travel(charger, 'Şarj istasyonuna gidiyor', true)) return false
        energy = 36
        emit('Şarj doldu. Robot kaldığı işe dönüyor.', 'success', 'energy')
        continue
      }
      if (!charging && equal(point, charger) && energy <= 12 && rules.energy === 'charge') {
        energy = 36
        emit('Şarj doldu. Yola devam!', 'success', 'energy')
      }
      const next = nextStreet(point, destination, level.roadClosed, rules.road === 'detour')
      if (!next) return stop('Robot geçebileceği bir yol bulamadı.', 'Yol kapalıyken alternatif bir sokak aramasını sağlayabilirsin.')
      if (level.roadClosed && equal(next, closure)) {
        return stop('Önümüzde yol çalışması var! Robot durdu.', 'Kapalı yola gelirse farklı bir sokak denemesini söyle.')
      }
      if (energy <= 0) return stop('Robotun pili bitti ve teslimat yarıda kaldı.', 'Pili azaldığında önce şarja gitmesini sağlayabilirsin.')
      point = next
      energy--
      emit(label, 'normal', 'move')
    }
    return equal(point, destination) || stop('Robot çok fazla yol denedi ve durdu.', 'Yol veya şarj kuralını yeniden düzenle.')
  }

  let rotations = 0
  while (delivered.size < level.packages.length && rotations++ < 24) {
    const pending = level.packages.filter((p) => !delivered.has(p.id))
    let current = pending[0]
    if (clock < current.readyAt && rules.unready === 'find-ready') {
      const ready = pending.find((p) => clock >= p.readyAt)
      if (ready) {
        current = ready
        emit('Bir paket bekliyor. Robot hazır siparişi seçti.', 'success', 'unready')
      }
    }
    if (clock < current.readyAt) {
      emit('Paket #' + current.id + ' henüz hazır değil.', 'warning', 'unready')
      while (clock < current.readyAt && frames.length < 220) emit('Depoda paketin hazırlanmasını bekliyor.', 'normal', 'unready')
    }

    for (const step of plan) {
      if (step === 'pickup') {
        if (!travel(depot, 'Depoya dönüyor')) break
        carrying = current.id
        emit('Paket #' + current.id + ' alındı.', 'success', 'pickup')
      }
      if (step === 'go') {
        if (!carrying) {
          stop('Robot yola çıktı ama yanında paket yok!', 'Önce depodan paketi almasını sağlamalısın.')
          break
        }
        if (!travel(current.at, current.address + ' adresine gidiyor')) break
        emit('Robot ' + current.address + ' adresine ulaştı.', 'normal', 'go')
      }
      if (step === 'deliver') {
        if (carrying !== current.id || !equal(point, current.at)) {
          stop('Robotun teslim edebileceği bir paket burada yok.', 'Teslimattan önce paketi alıp doğru adrese gitmesi gerekiyor.')
          break
        }
        if (current.lockedDoor) {
          emit('Kapı açılmadı! Robot ilk denemede teslim edemedi.', 'warning', 'doorstep')
          if (rules.doorstep !== 'retry') {
            stop('Robot ilk denemeden sonra vazgeçti.', 'Kapı açılmadığında bir kez daha denemesini söyle.')
            break
          }
          emit('Robot kapı zilini bir kez daha çalıyor...', 'normal', 'doorstep')
          emit('Bu kez kapı açıldı!', 'success', 'doorstep')
        }
        delivered.add(current.id)
        carrying = null
        emit('Paket #' + current.id + ' teslim edildi! 🎉', 'success', 'deliver')
      }
    }
    if (error) break
    if (delivered.size < level.packages.length && rules.continueWork === 'stop') {
      stop('İlk teslimat bitti ama depoda hâlâ paketler var.', 'İş kalmışsa robotun yeni siparişe geçmesi gerektiğini belirt.')
      break
    }
  }

  if (!error && delivered.size !== level.packages.length) {
    stop('Bazı teslimatlar hâlâ bekliyor.', 'Bütün siparişler bitene kadar çalışacak bir kural dene.')
  }
  if (!error) {
    emit('Tebrikler! Şehirdeki bütün paketler teslim edildi.', 'success')
  }
  return { frames, success: !error, conclusion: error || 'Bütün teslimatlar tamamlandı!',
    hint: error ? hint : 'Robotun yalnızca tek bir hareketi değil, farklı durumlarda nasıl davranacağını da belirledin.' }
}

const percent = (point: Point) => ({
  left: String(((point.x + .5) / W) * 100) + '%',
  top: String(((point.y + .5) / H) * 100) + '%',
})

function WorldMap({ level, frame }: { level: Level; frame: Frame }) {
  const tiles = useMemo(() => Array.from({ length: W * H }, (_, i) => ({ x: i % W, y: Math.floor(i / W) })), [])
  const decor: Record<string, string> = {
    '0-0': '🌳', '2-0': '🏢', '6-0': '🌲', '8-0': '🏙️',
    '0-4': '🌳', '0-5': '🏘️', '5-5': '🌳', '8-5': '🏢',
  }
  return (
    <div className="dw-city" aria-label="Robotun hareket ettiği şehir haritası">
      <div className="dw-grid" aria-hidden="true">
        {tiles.map((tile) => <div className="dw-tile" key={pointKey(tile)}>
          {decor[pointKey(tile)] && <span className="dw-decoration">{decor[pointKey(tile)]}</span>}
        </div>)}
      </div>
      <div className="dw-map-pin dw-depot" style={percent(depot)}><span>🏪</span><small>DEPO</small></div>
      <div className="dw-map-pin dw-charger" style={percent(charger)}><span>⚡</span><small>ŞARJ</small></div>
      {level.roadClosed && <div className="dw-roadblock" style={percent(closure)} title="Yol kapalı">🚧</div>}
      {level.packages.map((pack) => {
        const done = frame.delivered.includes(pack.id)
        const notReady = frame.clock < pack.readyAt
        return <div key={pack.id} className={'dw-map-pin dw-customer' + (done ? ' done' : '')}
          style={percent(pack.at)}>
          <span>{done ? '✅' : notReady ? '⏳' : '🏠'}</span>
          <small>{pack.address}</small>
        </div>
      })}
      <div className="dw-robot" style={percent(frame.point)} aria-label="Teslimat robotu">
        <span>🤖</span>{frame.carrying && <i>📦</i>}
      </div>
      <span className="dw-map-label">MİNİ ŞEHİR / CANLI SİMÜLASYON</span>
    </div>
  )
}

function RuleCard({ config, value, onChange, focused }: {
  config: (typeof ruleDescriptions)[number]
  value: string
  onChange: (value: string) => void
  focused: boolean
}) {
  return <div className={'dw-rule' + (focused ? ' focused' : '')}>
    <div className="dw-rule-question"><span>{config.emoji}</span><strong>{config.title}</strong></div>
    <div className="dw-rule-options">
      {config.options.map((option) =>
        <button key={option.value} type="button"
          className={value === option.value ? 'picked' : ''}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}>{option.title}</button>)}
    </div>
  </div>
}

export function DeliveryWorld() {
  const [stage, setStage] = useState(0)
  const [steps, setSteps] = useState<Step[]>(startingSteps)
  const [rules, setRules] = useState<Rules>(startingRules)
  const [frames, setFrames] = useState<Frame[]>([])
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [wins, setWins] = useState<boolean[]>([false, false, false, false])
  const level = levels[stage]
  const initialFrame: Frame = {
    point: depot, energy: level.battery, carrying: null, delivered: [], clock: 0,
    message: 'Robot hazır. Kuralları belirleyip çalıştırabilirsin.', tone: 'normal', focus: null,
  }
  const frame = frames[cursor] || initialFrame
  const finished = result !== null && cursor === frames.length - 1 && frames.length > 0
  const visibleRules = ruleDescriptions.filter((config) => config.from <= stage)
  const deliveryCount = frame.delivered.length

  useEffect(() => {
    if (!playing || frames.length < 2) return
    const timer = window.setInterval(() => {
      setCursor((value) => Math.min(value + 1, frames.length - 1))
    }, 160)
    return () => window.clearInterval(timer)
  }, [playing, frames.length])

  useEffect(() => {
    if (frames.length > 0 && cursor === frames.length - 1) {
      setPlaying(false)
      if (result?.success) {
        setWins((current) => current.map((win, index) => index === stage ? true : win))
      }
    }
  }, [cursor, frames.length, result, stage])

  function resetRun() {
    setPlaying(false)
    setFrames([])
    setCursor(0)
    setResult(null)
  }
  function changeLevel(index: number) {
    setStage(index)
    resetRun()
  }
  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= steps.length) return
    setSteps((current) => {
      const copy = [...current]
      const temp = copy[index]
      copy[index] = copy[target]
      copy[target] = temp
      return copy
    })
    resetRun()
  }
  function changeRule(key: RuleName, choice: string) {
    setRules((current) => ({ ...current, [key]: choice } as Rules))
    resetRun()
  }
  function start() {
    const next = simulate(level, steps, rules)
    setResult(next)
    setFrames(next.frames)
    setCursor(0)
    setPlaying(next.frames.length > 1)
  }
  function stepForward() {
    if (frames.length === 0) {
      const next = simulate(level, steps, rules)
      setResult(next)
      setFrames(next.frames)
      setCursor(Math.min(1, next.frames.length - 1))
      setPlaying(false)
    } else {
      setPlaying(false)
      setCursor((value) => Math.min(value + 1, frames.length - 1))
    }
  }
  function resetChoices() {
    setSteps(startingSteps)
    setRules(startingRules)
    resetRun()
  }

  return (
    <div className="dw-shell">
      <header className="dw-intro">
        <div>
          <div className="dw-eyebrow"><span className="dw-signal"/> ROTA · DENEYSEL ROBOT ŞEHRİ</div>
          <h2>Şehri sen yönet.</h2>
          <p>Bir robot, gerçek siparişler, değişen koşullar. Ona yalnızca nereye gideceğini değil, <strong>ne zaman ne yapacağını</strong> öğret.</p>
        </div>
        <div className="dw-overall-score"><span>ÇÖZÜLEN SENARYO</span><strong>{wins.filter(Boolean).length}<em>/4</em></strong></div>
      </header>

      <nav className="dw-chapters" aria-label="Şehir senaryoları">
        {levels.map((item, index) => <button type="button" key={item.name} onClick={() => changeLevel(index)}
          className={(index === stage ? 'active ' : '') + (wins[index] ? 'won' : '')}
          aria-current={index === stage ? 'step' : undefined}>
          <span className="dw-chapter-symbol">{wins[index] ? '✓' : item.icon}</span>
          <span><small>SAHNE {index + 1}</small><strong>{item.name}</strong></span>
        </button>)}
      </nav>

      <div className="dw-main">
        <aside className="dw-control-room">
          <div className="dw-panel-heading">
            <span>🧩 ROBOTUN TALİMATLARI</span>
            <small>DEĞİŞTİR · DENE · GÖZLEMLE</small>
          </div>
          <div className="dw-instructions">
            <div className="dw-section-title"><strong>İşleri hangi sırayla yapsın?</strong><small>↑ ↓ ile değiştir</small></div>
            {steps.map((step, index) => <div key={step} className={'dw-step ' + (frame.focus === step && playing ? 'glow' : '')}>
              <span className="dw-step-index">{index + 1}</span>
              <span className="dw-step-emoji">{stepInfo[step].icon}</span>
              <span className="dw-step-text"><strong>{stepInfo[step].title}</strong><small>{stepInfo[step].note}</small></span>
              <span className="dw-step-buttons">
                <button type="button" aria-label={stepInfo[step].title + ' yukarı'} onClick={() => moveStep(index, -1)} disabled={index === 0}>↑</button>
                <button type="button" aria-label={stepInfo[step].title + ' aşağı'} onClick={() => moveStep(index, 1)} disabled={index === steps.length - 1}>↓</button>
              </span>
            </div>)}
          </div>

          <div className="dw-rules-heading"><strong>Şehir değişirse ne yapsın?</strong>
            <small>{stage === 0 ? 'Yeni durumlar sonraki sahnede açılır.' : 'Her durumda davranışını sen seç.'}</small>
          </div>
          {visibleRules.length ? <div className="dw-rules">
            {visibleRules.map((config) => <RuleCard key={config.id} config={config}
              value={rules[config.id]} onChange={(choice) => changeRule(config.id, choice)}
              focused={frame.focus === config.id && playing}/>)}
          </div> :
            <div className="dw-locked-rule">🔒 İlk önce temel teslimat akışını çalıştır. Sonra robotun karşısına yeni sorunlar çıkacak.</div>}
          <div className="dw-execution-panel">
            <div className="dw-section-title"><strong>Robotu çalıştır</strong><small>Deneyip sonucu gözlemle</small></div>
            <div className="dw-scene-controls">
                        <button type="button" className="dw-play" onClick={start}>▶ {frames.length ? 'Yeniden çalıştır' : 'Çalıştır'}</button>
                        <button type="button" className="dw-neutral" onClick={() => setPlaying((value) => !value)}
                          disabled={frames.length < 2 || cursor >= frames.length - 1}>{playing ? '⏸ Duraklat' : '▶ Devam et'}</button>
                        <button type="button" className="dw-neutral" onClick={stepForward}>⏭ Tek adım</button>
                        <button type="button" className="dw-reset" onClick={resetRun}>↺ Başa sar</button>
                      </div>
            <div className={'dw-robot-message ' + frame.tone}>
                        <span className="dw-message-avatar">🤖</span>
                        <div><small>ROBOTTAN HABER VAR</small><strong>{frame.message}</strong></div>
                        {playing && <span className="dw-live-tag">● CANLI</span>}
                      </div>
            {finished && result &&
                        <div className={'dw-result ' + (result.success ? 'good' : 'bad')}>
                          <div className="dw-result-icon">{result.success ? '🏆' : '🛠️'}</div>
                          <div><strong>{result.conclusion}</strong><p>{result.hint}</p></div>
                          {result.success && stage < levels.length - 1 &&
                            <button type="button" onClick={() => changeLevel(stage + 1)}>Yeni sahne →</button>}
                        </div>}
          </div>
          <button className="dw-reset-all" type="button" onClick={resetChoices}>↻ Bütün talimatları sıfırla</button>
        </aside>

        <section className="dw-simulation">
          <div className="dw-scene-heading">
            <div><span className="dw-stage-label">SAHNE {stage + 1} / {levels.length}</span>
              <h3>{level.goal}</h3><p>{level.story}</p>
            </div>
            <span className="dw-destination-badge">{level.packages.length} PAKET</span>
          </div>
          <WorldMap level={level} frame={frame}/>
          <div className="dw-dashboard">
            <div><span>TESLİMAT</span><strong>{deliveryCount} <small>/ {level.packages.length}</small></strong></div>
            <div><span>ROBOT PİLİ</span><strong>{frame.energy} <small>/ 36</small></strong><div className="dw-battery"><i style={{width: String(frame.energy / 36 * 100) + '%'}}/></div></div>
            <div><span>GEÇEN ADIM</span><strong>{frame.clock}</strong></div>
            <div><span>TAŞIDIĞI</span><strong>{frame.carrying ? '#' + frame.carrying : '—'}</strong></div>
          </div>
        </section>
      </div>
      <div className="dw-footer-note"><span>✦</span> Burada kod yazmıyorsun. Ama bir sistemin kararlarını, tekrarlarını ve beklenmedik durumlarda nasıl davranacağını tasarlıyorsun.</div>
    </div>
  )
}
