export type DeviceKind = 'pc' | 'switch' | 'router' | 'server'
export type NetworkDevice = {
  id: string
  name: string
  kind: DeviceKind
  x: number
  y: number
  ip: string
  ip2: string
  mask: string
  gateway: string
}
export type NetworkLink = { id: string; from: string; to: string }
export type NetworkState = { devices: NetworkDevice[]; links: NetworkLink[] }
export type PingResult = {
  ok: boolean
  title: string
  detail: string
  requestPath: string[]
  replyPath: string[]
}
export type MissionCheck = { label: string; passed: boolean }
export type NetworkScenario = {
  title: string
  short: string
  icon: string
  topic: string
  story: string
  goal: string
  hint: string
  source: string
  target: string
  initial: NetworkState
}

export const deviceNames: Record<DeviceKind, string> = {
  pc: 'Bilgisayar', switch: 'Switch', router: 'Router', server: 'Sunucu',
}
export const deviceIcons: Record<DeviceKind, string> = {
  pc: '💻', switch: '🔀', router: '📡', server: '🗄️',
}
export const devicePorts: Record<DeviceKind, number> = {
  pc: 1, switch: 8, router: 4, server: 1,
}

const device = (
  id: string, name: string, kind: DeviceKind, x: number, y: number,
  ip = '', gateway = '', ip2 = '',
): NetworkDevice => ({ id, name, kind, x, y, ip, ip2, mask: '255.255.255.0', gateway })
const link = (from: string, to: string): NetworkLink => ({
  id: from + '-' + to, from, to,
})

export const scenarios: NetworkScenario[] = [
  {
    title: 'İlk bağlantı', short: 'İlk kablo', icon: '🔌',
    topic: '9. sınıf · Fiziksel bağlantı ve IP',
    story: 'Bilgisayar laboratuvarına iki bilgisayar geldi. İkisinin de IP adresi var ama birbirlerine ulaşamıyorlar.',
    goal: 'İki bilgisayarı kabloyla bağla ve PC-01 üzerinden PC-02’ye ping gönder.',
    hint: 'Önce “Kablo bağla” seçeneğini aç. PC-01 ve PC-02’ye sırayla tıkla. Sonra Ping testi bölümünden bağlantıyı dene.',
    source: 'pc1', target: 'pc2',
    initial: {
      devices: [
        device('pc1', 'PC-01', 'pc', 26, 48, '192.168.1.10'),
        device('pc2', 'PC-02', 'pc', 74, 48, '192.168.1.11'),
      ],
      links: [],
    },
  },
  {
    title: 'Laboratuvarı büyüt', short: 'Switch kur', icon: '🔀',
    topic: '9. sınıf · Yıldız topoloji ve switch',
    story: 'Okul üç bilgisayarlı yeni bir laboratuvar açtı. Cihazları tek bir merkezden haberleştirmelisin.',
    goal: 'Üç bilgisayarı switch’e bağla. PC-01 hem PC-02’ye hem PC-03’e ulaşabilsin.',
    hint: '“Kablo bağla” aracını aç. PC-01 → Switch, PC-02 → Switch ve PC-03 → Switch bağlantılarını oluştur. PC’ler aynı ağda olmalı.',
    source: 'pc1', target: 'pc3',
    initial: {
      devices: [
        device('pc1', 'PC-01', 'pc', 20, 25, '192.168.1.10'),
        device('pc2', 'PC-02', 'pc', 80, 25, '192.168.1.11'),
        device('pc3', 'PC-03', 'pc', 50, 81, '192.168.1.12'),
        device('sw1', 'LAB-SW', 'switch', 50, 44),
      ],
      links: [],
    },
  },
  {
    title: 'Adres çakışması', short: 'IP arızası', icon: '🧩',
    topic: '9–10. sınıf · IP yapılandırması ve hata ayıklama',
    story: 'Bilgisayarlar bağlı ama ağda bir sorun var: iki bilgisayara yanlışlıkla aynı IP adresi verilmiş!',
    goal: 'Çakışan IP adresini düzelt. Ardından PC-01’den PC-03’e ping gönder.',
    hint: 'PC-01 ve PC-03’ün IP bilgilerini karşılaştır. PC-03’e aynı alt ağda, kullanılmayan bir adres ver (ör. 192.168.1.12).',
    source: 'pc1', target: 'pc3',
    initial: {
      devices: [
        device('pc1', 'PC-01', 'pc', 20, 25, '192.168.1.10'),
        device('pc2', 'PC-02', 'pc', 80, 25, '192.168.1.11'),
        device('pc3', 'PC-03', 'pc', 50, 81, '192.168.1.10'),
        device('sw1', 'LAB-SW', 'switch', 50, 44),
      ],
      links: [link('pc1', 'sw1'), link('pc2', 'sw1'), link('pc3', 'sw1')],
    },
  },
  {
    title: 'İki binayı bağla', short: 'Router kur', icon: '🏫',
    topic: '10–11. sınıf · Alt ağ ve varsayılan ağ geçidi',
    story: 'Öğretmenler odası başka binada ve farklı bir IP ağında. İki bina birbirine bağlanmalı, ama bir kablo ve ağ geçidi ayarı eksik.',
    goal: 'Router ile sağ switch’i bağla, ÖĞRT-PC’nin ağ geçidini düzenle ve iki bina arasında ping çalıştır.',
    hint: 'Önce ROUTER ile ÖĞRT-SW arasına kablo çek. Sonra ÖĞRT-PC’ye tıkla ve Ağ geçidi değerini 192.168.20.1 yap. Router farklı alt ağların arasında yönlendirme yapar.',
    source: 'pc1', target: 'pc2',
    initial: {
      devices: [
        device('pc1', 'LAB-PC', 'pc', 13, 56, '192.168.10.10', '192.168.10.1'),
        device('sw1', 'LAB-SW', 'switch', 32, 56),
        device('r1', 'ROUTER', 'router', 51, 34, '192.168.10.1', '', '192.168.20.1'),
        device('sw2', 'ÖĞRT-SW', 'switch', 70, 56),
        device('pc2', 'ÖĞRT-PC', 'pc', 88, 56, '192.168.20.20'),
      ],
      links: [link('pc1', 'sw1'), link('sw1', 'r1'), link('sw2', 'pc2')],
    },
  },
]

export const emptyNetwork = (): NetworkState => ({ devices: [], links: [] })
export const cloneNetwork = (network: NetworkState): NetworkState => ({
  devices: network.devices.map((entry) => ({ ...entry })),
  links: network.links.map((entry) => ({ ...entry })),
})

const parseIP = (value: string): number | null => {
  const sections = value.trim().split('.')
  if (sections.length !== 4 || sections.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return null
  return sections.reduce((number, part) => ((number << 8) | Number(part)) >>> 0, 0)
}
const parseMask = (value: string): number | null => {
  const bits = parseIP(value)
  if (bits === null || bits === 0) return null
  const inverse = (~bits) >>> 0
  return (inverse & (inverse + 1)) === 0 ? bits : null
}
const sameSubnet = (a: string, b: string, mask: string) => {
  const first = parseIP(a)
  const second = parseIP(b)
  const subnetMask = parseMask(mask)
  return first !== null && second !== null && subnetMask !== null &&
    ((first & subnetMask) >>> 0) === ((second & subnetMask) >>> 0)
}
const endpoint = (entry: NetworkDevice) => entry.kind === 'pc' || entry.kind === 'server'

export function hasCable(network: NetworkState, a: string, b: string): boolean {
  return network.links.some((wire) =>
    (wire.from === a && wire.to === b) || (wire.from === b && wire.to === a))
}

function findPath(network: NetworkState, from: string, to: string): string[] | null {
  const queue: string[][] = [[from]]
  const visited = new Set([from])
  while (queue.length) {
    const path = queue.shift()!
    const current = path[path.length - 1]
    if (current === to) return path
    for (const wire of network.links) {
      const next = wire.from === current ? wire.to : wire.to === current ? wire.from : ''
      if (!next || visited.has(next)) continue
      const nextDevice = network.devices.find((entry) => entry.id === next)
      if (!nextDevice || (nextDevice.kind === 'router' && next !== to)) continue
      visited.add(next)
      queue.push([...path, next])
    }
  }
  return null
}

const failure = (title: string, detail: string, path: string[] = []): PingResult => ({
  ok: false, title, detail, requestPath: path, replyPath: [],
})
const success = (path: string[]): PingResult => ({
  ok: true,
  title: 'Ping başarılı! 🎉',
  detail: 'İstek hedef cihaza ulaştı ve yanıt kaynağa döndü. Sanal ağda 1 istek ve 1 yanıt işlendi.',
  requestPath: path,
  replyPath: [...path].reverse(),
})

export function runPing(network: NetworkState, sourceId: string, targetId: string): PingResult {
  const source = network.devices.find((entry) => entry.id === sourceId)
  const target = network.devices.find((entry) => entry.id === targetId)
  if (!source || !target || !endpoint(source) || !endpoint(target) || source.id === target.id) {
    return failure('Cihazları seçmelisin', 'Ping için iki farklı bilgisayar veya sunucu seç.')
  }
  if (parseIP(source.ip) === null || parseIP(target.ip) === null) {
    return failure('IP adresi geçersiz', 'Kaynak ve hedefte dört sayıdan oluşan geçerli IPv4 adresi olmalı.', [source.id])
  }
  if (parseMask(source.mask) === null || parseMask(target.mask) === null) {
    return failure('Alt ağ maskesi geçersiz', '255.255.255.0 gibi geçerli ve kesintisiz bir alt ağ maskesi kullan.', [source.id])
  }
  for (const current of [source, target]) {
    const conflict = network.devices.find((other) =>
      other.id !== current.id && endpoint(other) && other.ip === current.ip &&
      findPath(network, current.id, other.id) !== null)
    if (conflict) {
      return failure('IP adresi çakışması!', current.name + ' ve ' + conflict.name +
        ' aynı yerel ağda ' + current.ip + ' adresini kullanıyor. Birine farklı IP ver.', [source.id])
    }
  }
  const local = sameSubnet(source.ip, target.ip, source.mask) &&
    sameSubnet(source.ip, target.ip, target.mask)
  if (local) {
    const path = findPath(network, source.id, target.id)
    if (!path) return failure('Fiziksel bağlantı yok', 'Bu iki cihaz aynı IP ağında ancak aralarında çalışan bir kablo yolu bulunmuyor. Switch ve kabloları kontrol et.', [source.id])
    return success(path)
  }
  if (!source.gateway || parseIP(source.gateway) === null) {
    return failure('Kaynak ağ geçidi eksik', source.name + ' farklı ağa ulaşmak için bir varsayılan ağ geçidine ihtiyaç duyuyor.', [source.id])
  }
  if (!target.gateway || parseIP(target.gateway) === null) {
    return failure('Hedef ağ geçidi eksik', target.name + ' yanıtı farklı ağa gönderebilmek için bir varsayılan ağ geçidine ihtiyaç duyuyor.', [source.id])
  }
  for (const router of network.devices.filter((entry) => entry.kind === 'router')) {
    const interfacePairs: Array<[string, string]> = [
      [router.ip, router.ip2], [router.ip2, router.ip],
    ]
    for (const [near, far] of interfacePairs) {
      if (source.gateway !== near || target.gateway !== far ||
        !sameSubnet(source.ip, near, source.mask) ||
        !sameSubnet(target.ip, far, target.mask)) continue
      const first = findPath(network, source.id, router.id)
      const second = findPath(network, router.id, target.id)
      if (!first || !second) {
        return failure('Router bağlantısı eksik', 'Router doğru ağlara ayarlı ama iki bina arasında fiziksel yol tamamlanmamış. Kabloları kontrol et.', first ?? [source.id])
      }
      return success([...first, ...second.slice(1)])
    }
  }
  return failure('Yönlendirme yapılamadı', 'Farklı alt ağların iletişimi için router arayüz IP’leri ve iki bilgisayarın ağ geçidi değerleri eşleşmeli. Bu sürüm tek router üzerinden doğrudan bağlı iki ağı destekler.', [source.id])
}

export function missionChecks(index: number, network: NetworkState): MissionCheck[] {
  const reachable = (a: string, b: string) => runPing(network, a, b).ok
  if (index === 0) return [
    { label: 'İki bilgisayar arasında kablo var', passed: hasCable(network, 'pc1', 'pc2') },
    { label: 'PC-01, PC-02’ye ulaşabiliyor', passed: reachable('pc1', 'pc2') },
  ]
  if (index === 1) return [
    { label: 'Üç bilgisayar switch’e bağlı', passed: ['pc1', 'pc2', 'pc3'].every((id) => hasCable(network, id, 'sw1')) },
    { label: 'PC-01 → PC-02 bağlantısı çalışıyor', passed: reachable('pc1', 'pc2') },
    { label: 'PC-01 → PC-03 bağlantısı çalışıyor', passed: reachable('pc1', 'pc3') },
  ]
  if (index === 2) {
    const one = network.devices.find((entry) => entry.id === 'pc1')
    const three = network.devices.find((entry) => entry.id === 'pc3')
    return [
      { label: 'Çakışan IP adresleri düzeltildi', passed: !!one && !!three && one.ip !== three.ip && parseIP(three.ip) !== null },
      { label: 'PC-01 → PC-03 bağlantısı çalışıyor', passed: reachable('pc1', 'pc3') },
    ]
  }
  return [
    { label: 'Router ile öğretmenler switch’i kabloyla bağlı', passed: hasCable(network, 'r1', 'sw2') },
    { label: 'Öğretmen bilgisayarının ağ geçidi doğru', passed: network.devices.find((entry) => entry.id === 'pc2')?.gateway === '192.168.20.1' },
    { label: 'LAB-PC → ÖĞRT-PC farklı ağlarda haberleşiyor', passed: reachable('pc1', 'pc2') },
  ]
}
