import { useState } from 'react'

type Term = { id: string; title: string; icon: string; what: string; connect: string; example: string }

const terms: Term[] = [
  { id: 'pc', title: 'Bilgisayar (PC)', icon: '💻',
    what: 'Ağı kullanan cihazdır. Diğer bilgisayarlara ve sunucuya veri gönderir.',
    connect: 'Genellikle switch’e bağlanır. Bu laboratuvarda 1 kablo portu vardır.',
    example: 'PC-01 (192.168.1.10), PC-02’ye ping göndererek bağlantısını sınar.' },
  { id: 'switch', title: 'Switch', icon: '🔀',
    what: 'Aynı yerel ağdaki bilgisayarları ve sunucuları birbirine bağlayan merkezdir.',
    connect: 'PC, sunucu ve router’a kabloyla bağlanır. Bu simülasyonda 8 portu vardır.',
    example: '3 PC + 1 sunucu + 1 router bağlarsan 8 portun 5’ini kullanırsın.' },
  { id: 'router', title: 'Router', icon: '📡',
    what: 'Farklı IP ağlarını birbirine bağlayarak verilerin doğru ağa yönlendirilmesini sağlar.',
    connect: 'Genellikle switch’e bağlanır; her bilgisayarı tek tek router’a takman gerekmez. Bu simülasyonda 4 kablo portu vardır.',
    example: '192.168.10.x ağından 192.168.20.x ağına geçişi router sağlar.' },
  { id: 'server', title: 'Sunucu', icon: '🗄️',
    what: 'Diğer cihazlara web sitesi, dosya veya başka hizmetler sunabilen bir bilgisayardır.',
    connect: 'Genellikle switch’e bağlanır. Bu laboratuvarda 1 kablo portu vardır.',
    example: 'PC → Switch → Sunucu yolunu kurabilirsin. Bu ilk sürümde sunucuya ping gönderilir; web/dosya hizmeti simüle edilmez.' },
  { id: 'ip', title: 'IP adresi', icon: '🏷️',
    what: 'Bilgisayarın ağdaki sayısal adresidir. Veri paketinin hangi adrese gideceğini gösterir.',
    connect: 'PC ve sunucunun cihaz ayarlarından girilir; aynı yerel ağda çakışmamalıdır.',
    example: '192.168.1.10 ve 192.168.1.11, uygun maskeyle aynı ağda olabilir.' },
  { id: 'mask', title: 'Alt ağ maskesi', icon: '🧮',
    what: 'IP adresinin ağ kısmını belirler; iki adresin aynı yerel ağda olup olmadığını anlamamızı sağlar.',
    connect: 'Cihaz ayarlarında IP ile birlikte bulunur. Temel örnek: 255.255.255.0.',
    example: '192.168.1.10 ve 192.168.1.11, 255.255.255.0 maskesiyle aynı /24 ağındadır.' },
  { id: 'gateway', title: 'Ağ geçidi', icon: '🚪',
    what: 'Bilgisayarın kendi yerel ağı dışına veri göndermek için kullandığı router adresidir.',
    connect: 'PC ya da sunucunun “Varsayılan ağ geçidi” alanına o ağdaki router IP’si yazılır.',
    example: 'PC: 192.168.1.10, ağ geçidi: 192.168.1.1 olabilir. Başka ağa ping için doğru geçit gerekir.' },
]

export function NetworkGlossary() {
  const [active, setActive] = useState('pc')
  const term = terms.find((item) => item.id === active) ?? terms[0]

  return <section className="nw-glossary" aria-label="Ağ rehberi ve sözlük">
    <div className="nw-glossary-heading"><span>📚</span><div><strong>Ağ kurma rehberi</strong><small>Hangi cihaz nereye bağlanır?</small></div></div>
    <div className="nw-glossary-diagram" role="img" aria-label="PC-01, PC-02, sunucu ve router switch’e bağlanır">
      <svg viewBox="0 0 300 178" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g stroke="#70ccb3" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 4" fill="none">
          <path d="M150 86 L51 33 M150 86 L249 33 M150 86 L51 150 M150 86 L249 150"/>
        </g>
        {([
          { x: 51, y: 33, label: 'PC-01', icon: '💻' },
          { x: 249, y: 33, label: 'PC-02', icon: '💻' },
          { x: 150, y: 86, label: 'SWITCH', icon: '🔀' },
          { x: 51, y: 150, label: 'SUNUCU', icon: '🗄️' },
          { x: 249, y: 150, label: 'ROUTER', icon: '📡' },
        ]).map((item) => <g key={item.label}>
          <rect x={item.x - 34} y={item.y - 25} width="68" height="51" rx="9" fill="#1b3c50" stroke="#72b7b0"/>
          <text x={item.x} y={item.y + 2} textAnchor="middle" fontSize="20">{item.icon}</text>
          <text x={item.x} y={item.y + 17} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#d1f0ea">{item.label}</text>
        </g>)}
      </svg>
      <small>PC’ler ve sunucu switch’e bağlanır. Router başka ağlara geçiş sağlar.</small>
    </div>
    <div className="nw-glossary-tabs" role="group" aria-label="Ağ kavramı seç">
      {terms.map((item) => <button type="button" key={item.id} className={active === item.id ? 'active' : ''}
        aria-pressed={active === item.id} onClick={() => setActive(item.id)}>{item.icon} {item.title.split(' (')[0]}</button>)}
    </div>
    <div className="nw-glossary-detail" aria-live="polite">
      <strong>{term.icon} {term.title}</strong>
      <p>{term.what}</p>
      <span>Nereye bağlanır / nasıl kullanılır?</span>
      <p>{term.connect}</p>
      <span>Örnek</span>
      <p>{term.example}</p>
    </div>
    <p className="nw-glossary-disclaimer">Port sayıları gerçek cihazlara göre değişebilir; yukarıdaki sınırlar MeslekLab simülasyonu içindir.</p>
  </section>
}
