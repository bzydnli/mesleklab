import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  cloneNetwork, deviceIcons, deviceNames, devicePorts, emptyNetwork, hasCable,
  missionChecks, runPing, scenarios,
  type DeviceKind, type NetworkDevice, type NetworkLink, type NetworkState, type PingResult,
} from './networkEngine'
import { NetworkGlossary } from './NetworkGlossary'
import './NetworkPlayground.css'

type Mode = 'missions' | 'free'
type Notice = { tone: 'normal' | 'success' | 'warning'; text: string }
type PacketStep = { id: string; phase: 'istek' | 'yanıt' }
type DragState = { id: string; startX: number; startY: number; x: number; y: number; moved: boolean }

const PROGRESS_KEY = 'mesleklab-network-missions-v1'
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const endpoints = (state: NetworkState) => state.devices.filter((item) => item.kind === 'pc' || item.kind === 'server')

function loadProgress(): boolean[] {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]') as unknown
    if (Array.isArray(saved)) return scenarios.map((_, index) => saved[index] === true)
  } catch { /* Gizli pencere veya engellenmiş depolama olabilir. */ }
  return scenarios.map(() => false)
}

function deviceDefault(kind: DeviceKind, index: number): NetworkDevice {
  const number = index + 1
  return {
    id: kind + '-' + number,
    name: (kind === 'pc' ? 'PC' : deviceNames[kind].toUpperCase()) + '-' + number,
    kind,
    x: 20 + ((index * 19) % 65),
    y: 26 + ((index * 17) % 49),
    ip: kind === 'pc' ? '192.168.1.' + (10 + index) :
      kind === 'server' ? '192.168.1.' + (100 + index) :
        kind === 'router' ? '192.168.1.1' : '',
    ip2: kind === 'router' ? '192.168.2.1' : '',
    mask: '255.255.255.0',
    gateway: '',
  }
}

export function NetworkPlayground() {
  const [mode, setMode] = useState<Mode>('missions')
  const [missionIndex, setMissionIndex] = useState(0)
  const [missionWorlds, setMissionWorlds] = useState<Record<number, NetworkState>>({
    0: cloneNetwork(scenarios[0].initial),
  })
  const [freeWorld, setFreeWorld] = useState<NetworkState>(() => emptyNetwork())
  const [completed, setCompleted] = useState<boolean[]>(loadProgress)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null)
  const [cableMode, setCableMode] = useState(false)
  const [cableStart, setCableStart] = useState<string | null>(null)
  const [sourceId, setSourceId] = useState(scenarios[0].source)
  const [targetId, setTargetId] = useState(scenarios[0].target)
  const [notice, setNotice] = useState<Notice>({
    tone: 'normal', text: 'Bir cihaz seçerek ayarlarını incele veya kablo bağlamaya başla.',
  })
  const [hintOpen, setHintOpen] = useState(false)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [wiresOpen, setWiresOpen] = useState(false)
  const [freeSetup, setFreeSetup] = useState<'example' | 'blank' | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [missionReviewed, setMissionReviewed] = useState(false)
  const [ping, setPing] = useState<PingResult | null>(null)
  const [packetSteps, setPacketSteps] = useState<PacketStep[]>([])
  const [packetIndex, setPacketIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [nextId, setNextId] = useState(1)
  const boardRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const scenario = scenarios[missionIndex]
  const world = mode === 'free' ? freeWorld : (missionWorlds[missionIndex] ?? scenario.initial)
  const selected = world.devices.find((item) => item.id === selectedId) ?? null
  const selectedWire = world.links.find((wire) => wire.id === selectedWireId) ?? null
  const tests = useMemo(() => mode === 'missions' ? missionChecks(missionIndex, world) : [], [mode, missionIndex, world])
  const solvedCount = completed.filter(Boolean).length
  const connectedGoal = missionIndex === 0
    ? hasCable(world, 'pc1', 'pc2')
    : missionIndex === 1 || missionIndex === 2
      ? ['pc1', 'pc2', 'pc3'].every((id) => hasCable(world, id, 'sw1'))
      : hasCable(world, 'r1', 'sw2')
  const configurationGoal = connectedGoal && (missionIndex === 2
    ? (tests[0]?.passed ?? false)
    : missionIndex === 3 ? (tests[1]?.passed ?? false) : true)
  const pingGoal = !!ping?.ok && tests.every((item) => item.passed)
  const activeGuideStep = !connectedGoal ? 1 : !configurationGoal ? 2 : 3
  const possibleSources = endpoints(world)
  const source = possibleSources.some((item) => item.id === sourceId) ? sourceId : possibleSources[0]?.id ?? ''
  const target = possibleSources.some((item) => item.id === targetId && item.id !== source)
    ? targetId : possibleSources.find((item) => item.id !== source)?.id ?? ''
  const packet = packetSteps[packetIndex]
  const packetDevice = packet ? world.devices.find((item) => item.id === packet.id) : null

  useEffect(() => {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed)) } catch { /* İlerleme saklanamazsa oynanmaya devam edilir. */ }
  }, [completed])

  useEffect(() => {
    if (!playing || packetSteps.length < 2) return
    const timer = window.setTimeout(() => {
      if (packetIndex >= packetSteps.length - 1) setPlaying(false)
      else setPacketIndex((current) => current + 1)
    }, 620)
    return () => clearTimeout(timer)
  }, [playing, packetIndex, packetSteps.length])

  function resetSimulation() {
    setPing(null)
    setPacketSteps([])
    setPacketIndex(0)
    setPlaying(false)
    setMissionReviewed(false)
  }

  function editWorld(update: (network: NetworkState) => NetworkState) {
    resetSimulation()
    if (mode === 'free') setFreeWorld((current) => update(current))
    else setMissionWorlds((current) => ({
      ...current, [missionIndex]: update(current[missionIndex] ?? cloneNetwork(scenario.initial)),
    }))
  }

  function changeMode(next: Mode) {
    if (mode === next) return
    setMode(next)
    setSelectedId(null)
    setSelectedWireId(null)
    setCableMode(false)
    setCableStart(null)
    setHintOpen(false)
    setAdvancedOpen(false)
    setAddMenuOpen(false)
    setWiresOpen(false)
    resetSimulation()
    if (next === 'missions') {
      setSourceId(scenario.source)
      setTargetId(scenario.target)
      setNotice({ tone: 'normal', text: 'Görevde ilerlemek için kontrol listesini tamamla.' })
    } else {
      setSourceId('')
      setTargetId('')
      setNotice({ tone: 'normal', text: 'Cihaz ekle, kablo çek, IP ver. İstediğin ağı kurabilirsin.' })
    }
  }

  function changeMission(index: number) {
    setMissionIndex(index)
    setMissionWorlds((current) => current[index] ? current : {
      ...current, [index]: cloneNetwork(scenarios[index].initial),
    })
    setSourceId(scenarios[index].source)
    setTargetId(scenarios[index].target)
    setSelectedId(null)
    setSelectedWireId(null)
    setCableMode(false)
    setCableStart(null)
    setHintOpen(false)
    setAdvancedOpen(false)
    setAddMenuOpen(false)
    setWiresOpen(false)
    resetSimulation()
    setNotice({ tone: 'normal', text: 'Yeni görev yüklendi. Cihazlara dokunarak özelliklerini inceleyebilirsin.' })
  }

  function connectDevices(a: string, b: string) {
    if (a === b) {
      setNotice({ tone: 'warning', text: 'Bir cihazı kendisine kabloyla bağlayamazsın.' })
      return
    }
    if (hasCable(world, a, b)) {
      setNotice({ tone: 'warning', text: 'Bu iki cihaz zaten birbirine bağlı.' })
      return
    }
    for (const id of [a, b]) {
      const item = world.devices.find((entry) => entry.id === id)
      if (!item) return
      const used = world.links.filter((wire) => wire.from === id || wire.to === id).length
      if (used >= devicePorts[item.kind]) {
        setNotice({ tone: 'warning', text: item.name + ' üzerindeki bağlantı portları dolu. Önce bir kabloyu kaldır.' })
        return
      }
    }
    const link: NetworkLink = { id: 'wire-' + Date.now() + '-' + Math.floor(Math.random() * 10000), from: a, to: b }
    editWorld((current) => ({ ...current, links: [...current.links, link] }))
    setCableMode(false)
    setNotice({ tone: 'success', text: 'Kablo bağlandı! Şimdi IP ayarlarını kontrol edip ping testi yapabilirsin.' })
  }

  function tapDevice(id: string) {
    if (cableMode) {
      if (!cableStart) {
        setCableStart(id)
        setNotice({ tone: 'normal', text: 'İlk uç seçildi. Kablonun diğer ucunu bağlayacağın cihaza tıkla.' })
      } else {
        connectDevices(cableStart, id)
        setCableStart(null)
      }
      return
    }
    setSelectedId(id)
    setSelectedWireId(null)
    setAdvancedOpen(false)
  }

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    const item = world.devices.find((entry) => entry.id === id)
    if (!item) return
    dragRef.current = {
      id, startX: event.clientX, startY: event.clientY, x: item.x, y: item.y, moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    const drag = dragRef.current
    const bounds = boardRef.current?.getBoundingClientRect()
    if (!drag || drag.id !== id || !bounds || cableMode) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 7) return
    drag.moved = true
    const x = clamp(Math.round((drag.x + dx / bounds.width * 100) * 10) / 10, 8, 92)
    const y = clamp(Math.round((drag.y + dy / bounds.height * 100) * 10) / 10, 12, 87)
    editWorld((current) => ({ ...current, devices: current.devices.map((entry) =>
      entry.id === id ? { ...entry, x, y } : entry) }))
  }

  function finishDrag(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    const drag = dragRef.current
    if (!drag || drag.id !== id) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!drag.moved) tapDevice(id)
  }

  function editDevice(field: keyof NetworkDevice, value: string) {
    if (!selected) return
    editWorld((current) => ({
      ...current,
      devices: current.devices.map((item) => item.id === selected.id ? { ...item, [field]: value } : item),
    }))
  }

  function deleteSelection() {
    if (selectedWire) {
      editWorld((current) => ({ ...current, links: current.links.filter((wire) => wire.id !== selectedWire.id) }))
      setSelectedWireId(null)
      setNotice({ tone: 'normal', text: 'Kablo kaldırıldı. Bağlantıyı yeniden deneyebilirsin.' })
    } else if (selected && mode === 'free') {
      const id = selected.id
      editWorld((current) => ({
        devices: current.devices.filter((item) => item.id !== id),
        links: current.links.filter((wire) => wire.from !== id && wire.to !== id),
      }))
      setSelectedId(null)
      setNotice({ tone: 'normal', text: 'Cihaz ve ona bağlı kablolar kaldırıldı.' })
    }
  }

  function addDevice(kind: DeviceKind) {
    if (mode !== 'free' || world.devices.length >= 18) return
    const id = nextId
    setNextId(id + 1)
    const item = deviceDefault(kind, id)
    editWorld((current) => ({ ...current, devices: [...current.devices, item] }))
    setSelectedId(item.id)
    setSelectedWireId(null)
    setAddMenuOpen(false)
    setAdvancedOpen(false)
    setNotice({ tone: 'success', text: item.name + ' eklendi. Cihazı sürükleyebilir, ayarlarını değiştirebilirsin.' })
  }

  function createExampleNetwork() {
    if (mode !== 'free') return
    const example: NetworkState = {
      devices: [
        { id: 'demo-pc1', name: 'PC-01', kind: 'pc', x: 20, y: 32, ip: '192.168.1.10', ip2: '', mask: '255.255.255.0', gateway: '' },
        { id: 'demo-pc2', name: 'PC-02', kind: 'pc', x: 80, y: 32, ip: '192.168.1.11', ip2: '', mask: '255.255.255.0', gateway: '' },
        { id: 'demo-sw', name: 'SWITCH-01', kind: 'switch', x: 50, y: 66, ip: '', ip2: '', mask: '255.255.255.0', gateway: '' },
      ],
      links: [],
    }
    setFreeWorld(example)
    setFreeSetup('example')
    setSelectedId(null)
    setSelectedWireId(null)
    setCableMode(false)
    setCableStart(null)
    setAddMenuOpen(false)
    setWiresOpen(false)
    resetSimulation()
    setNotice({ tone: 'normal', text: 'İki bilgisayar ve bir switch hazır. Şimdi kabloları sen bağlayıp ping gönder.' })
  }

  function deleteWire(id: string) {
    if (!world.links.some((item) => item.id === id)) return
    editWorld((current) => ({ ...current, links: current.links.filter((wire) => wire.id !== id) }))
    setSelectedWireId(null)
    setNotice({ tone: 'success', text: 'Kablo kaldırıldı. İstersen iki cihazı yeniden bağlayabilirsin.' })
  }

  function sendPing() {
    if (!source || !target) {
      setNotice({ tone: 'warning', text: 'Ping testi için en az iki bilgisayar veya sunucu gerekiyor.' })
      return
    }
    const outcome = runPing(world, source, target)
    const frames: PacketStep[] = [
      ...outcome.requestPath.map((id) => ({ id, phase: 'istek' as const })),
      ...outcome.replyPath.slice(1).map((id) => ({ id, phase: 'yanıt' as const })),
    ]
    setPing(outcome)
    setPacketSteps(frames)
    setPacketIndex(0)
    setPlaying(frames.length > 1)
    const cleared = mode === 'missions' && outcome.ok && missionChecks(missionIndex, world).every((check) => check.passed)
    setMissionReviewed(cleared)
    setNotice({ tone: cleared ? 'success' : outcome.ok ? 'normal' : 'warning',
      text: cleared ? 'Görev tamamlandı! Ağın çalışıyor; yeni göreve geçebilirsin.' :
        outcome.ok && mode === 'missions' ? 'Ping başarılı! Diğer hedeflerin durumunu soldaki rehberden kontrol et.' : outcome.detail })
    if (cleared) setCompleted((old) => old.map((item, index) => index === missionIndex ? true : item))
  }

  function restartWorld() {
    if (mode === 'free') setFreeWorld(emptyNetwork())
    else setMissionWorlds((current) => ({ ...current, [missionIndex]: cloneNetwork(scenario.initial) }))
    setSelectedId(null)
    setSelectedWireId(null)
    setCableStart(null)
    setCableMode(false)
    setAddMenuOpen(false)
    setAdvancedOpen(false)
    setWiresOpen(false)
    if (mode === 'free') setFreeSetup(null)
    resetSimulation()
    setNotice({ tone: 'normal', text: 'Çalışma alanı başlangıç durumuna getirildi.' })
  }

  return <div className="nw-shell">
    <header className="nw-hero">
      <div className="nw-hero-copy">
        <div className="nw-eyebrow"><span className="nw-pulse"/> MESLEKLAB · AĞ KONTROL MERKEZİ</div>
        <h2>Bağlantıyı sen kur.</h2>
        <p>Okulun ağ yöneticisi ol. Cihazları yerleştir, kablo çek, IP adreslerini ayarla ve veri paketlerinin gerçekten nereye gittiğini keşfet.</p>
      </div>
      <div className="nw-hero-metric"><small>TAMAMLANAN GÖREV</small><strong>{solvedCount}<span> / {scenarios.length}</span></strong>
        <div className="nw-metric-bars">{scenarios.map((entry, index) =>
          <i key={entry.title} className={completed[index] ? 'done' : ''}/>)}</div>
      </div>
    </header>

    <div className="nw-mode-tabs" role="group" aria-label="Ağ laboratuvarı modu">
      <button type="button" className={mode === 'missions' ? 'active' : ''} aria-pressed={mode === 'missions'}
        onClick={() => changeMode('missions')}><span>🏫</span><span><strong>Okul görevleri</strong><small>Adım adım bir ağ kur</small></span></button>
      <button type="button" className={mode === 'free' ? 'active' : ''} aria-pressed={mode === 'free'}
        onClick={() => changeMode('free')}><span>🧪</span><span><strong>Serbest laboratuvar</strong><small>Kendi ağını tasarla</small></span></button>
    </div>

    {mode === 'missions' && <nav className="nw-missions" aria-label="Okul ağı görevleri">
      {scenarios.map((item, index) => <button type="button" key={item.title}
        onClick={() => changeMission(index)}
        className={(index === missionIndex ? 'active ' : '') + (completed[index] ? 'completed' : '')}
        aria-current={index === missionIndex ? 'step' : undefined}>
        <span className="nw-mission-icon">{completed[index] ? '✓' : item.icon}</span>
        <span><small>GÖREV {String(index + 1).padStart(2, '0')}</small><strong>{item.short}</strong></span>
      </button>)}
    </nav>}

    <div className="nw-workspace nw-workspace-v2">
      <aside className="nw-guide" aria-label={mode === 'missions' ? 'Görev rehberi' : 'Serbest laboratuvar rehberi'}>
        {mode === 'missions' ? <section className="nw-card nw-mission-brief nw-guide-card">
          <span className="nw-kicker">{scenario.topic}</span>
          <div className="nw-guide-heading"><span className="nw-guide-chapter">GÖREV {String(missionIndex + 1).padStart(2, '0')}</span><h3>{scenario.title}</h3></div>
          <p>{scenario.story}</p>
          <div className="nw-task"><span>🎯</span><strong>{scenario.goal}</strong></div>

          <div className="nw-guide-section-heading"><strong>Şimdi ne yapacağım?</strong><span>3 adım</span></div>
          <ol className="nw-guide-steps">
            <li className={connectedGoal ? 'finished' : activeGuideStep === 1 ? 'current' : ''}>
              <span className="nw-guide-step-number">{connectedGoal ? '✓' : '1'}</span>
              <div><strong>Kabloları bağla</strong><small>“Kablo bağla” aracını açıp sahnedeki cihazları seç.</small></div>
            </li>
            <li className={configurationGoal ? 'finished' : activeGuideStep === 2 ? 'current' : ''}>
              <span className="nw-guide-step-number">{configurationGoal ? '✓' : '2'}</span>
              <div><strong>IP ayarlarını kontrol et</strong><small>{missionIndex === 3
                ? 'Öğretmen bilgisayarına uygun ağ geçidini ver.'
                : missionIndex === 2 ? 'Çakışan IP adresini bulup düzelt.' : 'Cihazlara tıkla, IP bilgilerini incele.'}</small></div>
            </li>
            <li className={pingGoal ? 'finished' : activeGuideStep === 3 ? 'current' : ''}>
              <span className="nw-guide-step-number">{pingGoal ? '✓' : '3'}</span>
              <div><strong>Ping ile test et</strong><small>Haritanın hemen altındaki “Ping gönder” düğmesine bas.</small></div>
            </li>
          </ol>

          <button className="nw-hint-toggle" type="button" aria-expanded={hintOpen} onClick={() => setHintOpen(!hintOpen)}>
            💡 {hintOpen ? 'İpucunu gizle' : 'Takıldın mı? İpucu al'} <span>{hintOpen ? '−' : '+'}</span>
          </button>
          {hintOpen && <div className="nw-hint">{scenario.hint}</div>}
          <div className="nw-guide-checks"><div className="nw-guide-checks-heading">
            <strong>Görevin hedefleri</strong><span>{tests.filter((item) => item.passed).length}/{tests.length}</span>
          </div>
            {tests.map((check) => <div key={check.label} className={'nw-guide-check ' + (check.passed ? 'passed' : '')}>
              <span>{check.passed ? '✓' : '○'}</span><span>{check.label}</span>
            </div>)}
          </div>
          {missionReviewed && <div className="nw-mission-done">
            <strong>🏆 Görev tamamlandı!</strong>
            <p>Yaptığın ping testi başarılı, ağın tüm hedefleri karşılıyor.</p>
            {missionIndex < scenarios.length - 1 &&
              <button type="button" onClick={() => changeMission(missionIndex + 1)}>Sonraki göreve geç →</button>}
          </div>}
        </section> : <section className="nw-card nw-guide-card">
          <span className="nw-kicker">🧪 SERBEST LABORATUVAR</span>
          <h3>Sen tasarla, sen dene.</h3>
          <p>İstersen iki bilgisayardan başla, istersen switch ve router kullanarak yeni bir ağ kur.</p>
          <ol className="nw-guide-steps">
            <li className={world.devices.length ? 'finished' : 'current'}>
              <span className="nw-guide-step-number">{world.devices.length ? '✓' : '1'}</span>
              <div><strong>Cihaz ekle</strong><small>Sahnenin üstündeki “+ Cihaz ekle” düğmesini kullan.</small></div>
            </li>
            <li className={world.links.length ? 'finished' : ''}>
              <span className="nw-guide-step-number">{world.links.length ? '✓' : '2'}</span>
              <div><strong>Kabloyla bağla</strong><small>Önce “Kablo bağla”ya bas, sonra iki cihaz seç.</small></div>
            </li>
            <li className={ping?.ok ? 'finished' : ''}>
              <span className="nw-guide-step-number">{ping?.ok ? '✓' : '3'}</span>
              <div><strong>Ping ile dene</strong><small>IP adreslerini kontrol et, kaynak ve hedefi seçip ping gönder.</small></div>
            </li>
          </ol>
          {world.devices.length === 0 && freeSetup === null && <div className="nw-start-picker">
            <strong>✨ İlk ağını nasıl kurmak istersin?</strong>
            <p>Örnekle başlarsan cihazlar yerleşir, kabloları ve IP kontrolünü sen yaparsın.</p>
            <button type="button" className="nw-start-primary" onClick={createExampleNetwork}>🖥️ Örnek ağ oluştur</button>
            <button type="button" className="nw-start-secondary" onClick={() => {
              setFreeSetup('blank')
              setNotice({ tone: 'normal', text: 'Boş çalışma alanın hazır. Sahnenin üstünden yeni cihaz ekleyebilirsin.' })
            }}>＋ Boş ağdan başla</button>
          </div>}
          <NetworkGlossary/>
          <small className="nw-limits">En fazla 18 cihaz ekleyebilirsin. PC/sunucu 1, switch 8, router 4 bağlantı portu kullanır.</small>
        </section>}
      </aside>

      <main className="nw-main nw-main-v2">
        <section className="nw-map-card nw-workbench-card">
          <header className="nw-map-heading nw-map-heading-v2">
            <div>
              <span className="nw-kicker">{mode === 'missions' ? 'OKULUN DİJİTAL PLANI' : 'SERBEST KURULUM'}</span>
              <h3>Ağ çalışma alanı</h3>
              <p>Bağla · Bir cihaza dokunup ayarla · Hemen aşağıda test et</p>
            </div>
            <div className="nw-map-stats"><span>◉ {world.devices.length} cihaz</span><span>⌁ {world.links.length} kablo</span></div>
          </header>

          <div className="nw-scene-toolbar" role="toolbar" aria-label="Ağ sahnesi araçları">
            <button type="button" className={'nw-tool-button ' + (cableMode ? 'nw-tool-active' : '')}
              aria-pressed={cableMode} onClick={() => {
                setCableMode(!cableMode)
                setCableStart(null)
                setSelectedId(null)
                setSelectedWireId(null)
                setAddMenuOpen(false)
                setNotice({ tone: 'normal', text: cableMode ? 'Kablo modu kapatıldı. Bir cihaza tıklayarak ayarlarını açabilirsin.' :
                  'Kablo modu açık. Önce ilk cihaza, sonra bağlayacağın diğer cihaza tıkla.' })
              }}>{cableMode ? '✓ Kablo modu açık' : '🔌 Kablo bağla'}</button>
            {cableMode && <button type="button" className="nw-tool-button nw-select-tool" onClick={() => {
              setCableMode(false); setCableStart(null)
              setNotice({ tone: 'normal', text: 'Cihaz seçme moduna döndün. Bir cihaza dokunarak ayarlarını aç.' })
            }}>↖ Cihaz seç</button>}

            {mode === 'free' && <div className="nw-add-tools">
              <button type="button" className={'nw-tool-button nw-add-toggle ' + (addMenuOpen ? 'nw-tool-active' : '')}
                aria-expanded={addMenuOpen} onClick={() => { setAddMenuOpen((current) => !current); setCableMode(false); setCableStart(null) }}>＋ Cihaz ekle</button>
              {addMenuOpen && <div className="nw-add-menu" role="group" aria-label="Yeni cihaz ekle">
                {(['pc', 'switch', 'router', 'server'] as DeviceKind[]).map((kind) =>
                  <button type="button" key={kind} disabled={world.devices.length >= 18} onClick={() => addDevice(kind)}>
                    <span>{deviceIcons[kind]}</span><span>{deviceNames[kind]}</span><strong>+</strong>
                  </button>)}
              </div>}
            </div>}

            <button type="button" className="nw-tool-button nw-reset-tool" onClick={restartWorld}>↺ Başa al</button>
          </div>

          <div className={'nw-scene-help ' + (cableMode ? 'cable' : '')} aria-live="polite">
            <span className="nw-scene-help-icon">{cableMode ? '🔌' : '☝'}</span>
            <div><strong>{cableMode ? cableStart ? 'İlk cihaz seçildi. İkinci cihaza dokun.' : 'Kablo bağlama modu' :
              selected ? selected.name + ' seçildi' : 'Ağ sahnesi hazır'}</strong>
              <small>{cableMode ? 'İki cihazı sırayla seçerek bağlantıyı tamamla.' :
                selected ? 'IP ayarları sahnenin sağında açıldı.' :
                  mode === 'missions' && !connectedGoal ? 'Üstteki “Kablo bağla” düğmesiyle başla.' :
                    'Cihaza tıkla: ayarları açılır. Kabloya dokun: bağlantı seçilir.'}</small></div>
          </div>

          <div className="nw-stage-wrap">
            <div className="nw-board nw-board-v2" ref={boardRef} aria-label="Sanal ağ topolojisi">
              <div className="nw-board-area area-a">{mode === 'missions' && missionIndex === 3 ? 'BİLGİSAYAR LABORATUVARI' : 'OKUL AĞI'}</div>
              {mode === 'missions' && missionIndex === 3 && <div className="nw-board-area area-b">ÖĞRETMENLER ODASI</div>}
              <div className="nw-board-grid" aria-hidden="true"/>
              <svg className="nw-wire-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Ağ kabloları">
                {world.links.map((wire) => {
                  const a = world.devices.find((item) => item.id === wire.from)
                  const b = world.devices.find((item) => item.id === wire.to)
                  if (!a || !b) return null
                  return <g key={wire.id} className={selectedWireId === wire.id ? 'wire-selected' : ''}>
                    <line className="nw-wire-hit" x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      onClick={() => {
                        if (!cableMode) { setSelectedWireId(wire.id); setSelectedId(null); setAdvancedOpen(false) }
                      }}/>
                    <line className="nw-wire-visible" x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>
                  </g>
                })}
              </svg>
              {world.devices.map((item) => {
                const wiresUsed = world.links.filter((wire) => wire.from === item.id || wire.to === item.id).length
                return <button type="button" key={item.id}
                  className={'nw-node nw-node-' + item.kind + (selectedId === item.id ? ' selected' : '') +
                    (cableStart === item.id ? ' cable-start' : '')}
                  style={{ left: item.x + '%', top: item.y + '%' }}
                  onPointerDown={(event) => startDrag(event, item.id)}
                  onPointerMove={(event) => moveDrag(event, item.id)}
                  onPointerUp={(event) => finishDrag(event, item.id)}
                  onPointerCancel={() => { dragRef.current = null }}
                  onClick={(event) => { if (event.detail === 0) tapDevice(item.id) }}
                  aria-label={item.name + ', ' + deviceNames[item.kind] + '. Düzenlemek için seç.'}
                  aria-pressed={selectedId === item.id}>
                  <span className="nw-node-icon">{deviceIcons[item.kind]}</span>
                  <strong>{item.name}</strong>
                  <small>{item.ip || wiresUsed + ' port bağlı'}</small>
                  <i className={'nw-port-dot ' + (wiresUsed ? 'connected' : '')}/>
                </button>
              })}
              {packetDevice && <div className={'nw-packet ' + (packet?.phase === 'yanıt' ? 'reply' : '')}
                style={{ left: packetDevice.x + '%', top: packetDevice.y + '%' }} aria-hidden="true">✉</div>}
              {world.devices.length === 0 && <div className="nw-board-empty">
                <span>✳</span><strong>Boş ağ çalışma alanı</strong>
                <p>Yukarıdaki “+ Cihaz ekle” düğmesinden başlayabilirsin.</p>
              </div>}
              {cableMode && <div className="nw-board-instruction">🔌 {cableStart ? 'İkinci cihazı seç' : 'İlk cihazı seç'}</div>}
              <div className="nw-board-watermark">MESLEKLAB / NETWORK SIMULATOR</div>
            </div>

            {(selected || selectedWire) && <div className="nw-inspector-drawer" role="region"
              aria-label={selected ? 'Seçili cihaz ayarları' : 'Seçili kablo'}>
              <div className="nw-drawer-head">
                <div><span className="nw-kicker">{selected ? 'CİHAZ AYARLARI' : 'KABLO BAĞLANTISI'}</span>
                  <strong>{selected?.name ?? 'Kablo seçildi'}</strong></div>
                <button type="button" aria-label="Ayarları kapat"
                  onClick={() => { setSelectedId(null); setSelectedWireId(null) }}>×</button>
              </div>
              {selected ? <>
                <div className="nw-selection-heading"><span>{deviceIcons[selected.kind]}</span>
                  <div><strong>{deviceNames[selected.kind]}</strong>
                    <small>{world.links.filter((wire) => wire.from === selected.id || wire.to === selected.id).length} / {devicePorts[selected.kind]} port bağlı</small></div></div>
                <label className="nw-field">Cihaz adı
                  <input value={selected.name} maxLength={24} onChange={(event) => editDevice('name', event.target.value)}/>
                </label>
                {selected.kind === 'switch'
                  ? <div className="nw-inspector-tip">Switch, aynı yerel ağdaki cihazları birbirine bağlar. Bu temel simülasyonda ona IP vermen gerekmiyor.</div>
                  : <>
                    <label className="nw-field">{selected.kind === 'router' ? 'Arayüz A · IP adresi' : 'IP adresi'}
                      <input value={selected.ip} onChange={(event) => editDevice('ip', event.target.value)}
                        placeholder="192.168.1.10" inputMode="decimal"/>
                    </label>
                    {selected.kind === 'router' && <label className="nw-field">Arayüz B · IP adresi
                      <input value={selected.ip2} onChange={(event) => editDevice('ip2', event.target.value)}
                        placeholder="192.168.2.1" inputMode="decimal"/>
                    </label>}
                    {mode === 'missions' && missionIndex < 3 && !advancedOpen && <button className="nw-advanced-toggle"
                      type="button" onClick={() => setAdvancedOpen(true)}>+ Diğer ağ ayarlarını göster</button>}
                    {(mode === 'free' || missionIndex >= 3 || advancedOpen) && <>
                      <label className="nw-field">Alt ağ maskesi
                        <input value={selected.mask} onChange={(event) => editDevice('mask', event.target.value)}
                          placeholder="255.255.255.0" inputMode="decimal"/>
                      </label>
                      {selected.kind !== 'router' && <label className="nw-field">Varsayılan ağ geçidi
                        <input value={selected.gateway} onChange={(event) => editDevice('gateway', event.target.value)}
                          placeholder="192.168.1.1" inputMode="decimal"/>
                      </label>}
                    </>}
                    <div className="nw-inspector-tip">{mode === 'missions' && missionIndex === 0
                      ? 'IP adresi, bilgisayarın ağdaki adresidir. Bu görevde değerleri değiştirmeden kabloyla bağlantıyı kurabilirsin.'
                      : mode === 'missions' && missionIndex === 2
                        ? 'Aynı ağdaki iki bilgisayara aynı IP adresi verilmemeli.'
                        : mode === 'missions' && missionIndex === 3
                          ? 'Başka ağa ulaşmak için ağ geçidi, router’ın bu ağa bağlı arayüzünün IP adresidir.'
                          : 'IP cihazı tanımlar, maske hangi ağda olduğunu gösterir; farklı ağa çıkmak için ağ geçidi kullanılır.'}</div>
                  </>}
                {mode === 'free' && <button className="nw-delete" type="button" onClick={deleteSelection}>🗑 Cihazı kaldır</button>}
              </> : selectedWire && <>
                <div className="nw-wire-detail">🔌 {world.devices.find((item) => item.id === selectedWire.from)?.name}
                  <span> ↔ </span>{world.devices.find((item) => item.id === selectedWire.to)?.name}</div>
                <p className="nw-wire-help">Kabloyu kaldırmak, bu iki cihaz arasındaki fiziksel yolu keser.</p>
                <button className="nw-delete" type="button" onClick={deleteSelection}>Kabloyu kaldır</button>
              </>}
            </div>}
          </div>

          <div className={'nw-feedback-strip ' + notice.tone} aria-live="polite">
            <span>{notice.tone === 'success' ? '✓' : notice.tone === 'warning' ? '!' : 'ℹ'}</span>
            <p>{notice.text}</p>
          </div>

          <section className="nw-ping-dock" aria-label="Bağlantıyı test et">
            <div className="nw-ping-heading">
              <div><span className="nw-kicker">SON ADIM · AĞ TESTİ</span>
                <h3>📨 Bağlantıyı test et</h3>
                <p>Kurduğun ağ üzerinden bir veri paketi gönder.</p>
              </div>
              {ping && <span className={'nw-ping-status ' + (ping.ok ? 'good' : 'bad')}>
                {ping.ok ? '✓ Ulaşıldı' : '✕ Ulaşılamadı'}</span>}
            </div>
            <div className="nw-ping-controls">
              {mode === 'missions' ? <div className="nw-auto-ping-pair">
                <span><small>KAYNAK</small><strong>{world.devices.find((entry) => entry.id === scenario.source)?.name}</strong></span>
                <span className="nw-auto-arrow">→</span>
                <span><small>HEDEF</small><strong>{world.devices.find((entry) => entry.id === scenario.target)?.name}</strong></span>
              </div> : <>
                <label>Kaynak cihaz
                  <select value={source} onChange={(event) => { setSourceId(event.target.value); resetSimulation() }}>
                    {possibleSources.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.ip || 'IP yok'})</option>)}
                  </select>
                </label>
                <span className="nw-ping-arrow">→</span>
                <label>Hedef cihaz
                  <select value={target} onChange={(event) => { setTargetId(event.target.value); resetSimulation() }}>
                    {possibleSources.filter((item) => item.id !== source).map((item) =>
                      <option key={item.id} value={item.id}>{item.name} ({item.ip || 'IP yok'})</option>)}
                  </select>
                </label>
              </>}
              <button type="button" onClick={sendPing} disabled={!source || !target}>▶ Ping gönder</button>
            </div>

            {ping ? <div className={'nw-terminal-result ' + (ping.ok ? 'success' : 'error')}>
              <div className="nw-terminal-top"><span className="nw-terminal-dot"/><span>AG_DIAGNOSTIC.exe</span>
                <span className="nw-terminal-tag">SİMÜLASYON</span></div>
              <div className="nw-terminal-content">
                <div className="nw-command">$ ping {world.devices.find((item) => item.id === target)?.ip ?? 'hedef'}</div>
                <strong>{ping.title}</strong>
                <p>{ping.detail}</p>
                {ping.requestPath.length > 1 && <div className="nw-path">
                  {ping.requestPath.map((id, index) => <span key={id + '-' + index}>
                    {index > 0 && <b>→</b>}{world.devices.find((item) => item.id === id)?.name ?? id}</span>)}
                </div>}
                {packet && <div className="nw-packet-caption">✉ {packet.phase === 'istek' ? 'İstek gidiyor' : 'Yanıt dönüyor'}: {world.devices.find((item) => item.id === packet.id)?.name}</div>}
              </div>
            </div> : <div className="nw-terminal-empty"><span>$ _</span>
              {mode === 'missions' ? 'Görevin bağlantısını denemek için “Ping gönder”e bas.' :
                'Cihazları kurduktan sonra kaynak ve hedef seçip ping gönderebilirsin.'}
            </div>}
            {packetSteps.length > 1 && <div className="nw-packet-controls">
              <button type="button" onClick={() => { setPacketIndex(0); setPlaying(true) }}>↺ Yeniden oynat</button>
              <button type="button" onClick={() => setPlaying((current) => !current)}
                disabled={packetIndex >= packetSteps.length - 1 && !playing}>{playing ? '⏸ Duraklat' : '▶ Devam et'}</button>
              <button type="button" onClick={() => { setPlaying(false); setPacketIndex((index) => Math.min(index + 1, packetSteps.length - 1)) }}
                disabled={packetIndex >= packetSteps.length - 1}>⏭ Tek adım</button>
              <span>{packetIndex + 1} / {packetSteps.length}</span>
            </div>}
          </section>

          {world.links.length > 0 && <details className="nw-link-disclosure">
            <summary>🔌 Bağlantıları yönet <span>{world.links.length} kablo</span></summary>
            <div>{world.links.map((wire) => <button type="button" key={wire.id}
              onClick={() => { setSelectedWireId(wire.id); setSelectedId(null); setCableMode(false); setCableStart(null) }}>
              {world.devices.find((item) => item.id === wire.from)?.name} ↔ {world.devices.find((item) => item.id === wire.to)?.name}
            </button>)}</div>
          </details>}
        </section>
      </main>
    </div>
    <footer className="nw-footer">✦ Bu laboratuvar sanal bir eğitim simülasyonudur. Temel IPv4, kablolama, switch ve tek router ile doğrudan ağlar arasındaki iletişim modellenir; gerçek cihazlara veya internete bağlanmaz.</footer>
  </div>
}
