import type { AreaDefinition, LabDefinition } from '../types'

export const areas: AreaDefinition[] = [
  {
    id: 'bilisim',
    title: 'Bilişim Teknolojileri',
    icon: '💻',
    eyebrow: 'Kodla · Kur · Keşfet',
    description: 'Algoritmadan yapay zekâya, ağlardan donanıma kadar bilişim konularını deneyerek öğren.',
    path: '/bilisim',
    accent: 'blue',
  },
  {
    id: 'elektrik-elektronik',
    title: 'Elektrik-Elektronik',
    icon: '⚡',
    eyebrow: 'Bağla · Ölç · Gözlemle',
    description: 'Devrelerden sensörlere, mikrodenetleyiciden PLC otomasyonuna kadar sanal atölyede çalış.',
    path: '/elektrik-elektronik',
    accent: 'amber',
  },
]

export const labs: LabDefinition[] = [
  {
    id: 'algoritma', areaId: 'bilisim', title: 'Algoritma Laboratuvarı', shortTitle: 'Algoritma', icon: '🧩',
    description: 'Bir teslimat şehri kur: robotunun adımlarını tasarla, yeni durumlara çözüm bul ve sistemi çalıştırarak dene.', grade: '9. sınıf seviyesi', status: 'ready', path: '/bilisim/algoritma',
    topics: ['Problem çözme', 'Karar verme', 'Tekrarlar', 'Beklenmedik durumlar'],
    outcomes: ['Bir işi adımlara ayırma', 'Adımlar arasındaki sırayı kurma', 'Eksik ve belirsiz adımları fark etme'],
  },
  {
    id: 'programlama', areaId: 'bilisim', title: 'Programlama Laboratuvarı', shortTitle: 'Programlama', icon: '⌨️',
    description: 'Dijital Ürün Stüdyosu: gerçek JavaScript yazarak kendi bilet uygulamanı adım adım geliştir, çalıştır ve test et.', grade: '9–12. sınıf seviyeleri', status: 'ready', path: '/bilisim/programlama',
    topics: ['JavaScript', 'Koşullar', 'Döngüler', 'Fonksiyonlar', 'Veri yönetimi'],
    outcomes: ['Gerçek kod yazarak özellik geliştirme', 'Koşullar ve tekrarlarla veri işleme', 'Kodunu farklı durumlarla test edip düzeltme'],
  },
  {
    id: 'ag', areaId: 'bilisim', title: 'Ağ Laboratuvarı', shortTitle: 'Ağ', icon: '🌐',
    description: 'Okulun ağ yöneticisi ol: kablo çek, IP ayarlarını düzenle, ping paketlerini izle; sonra serbest laboratuvarda kendi ağını kur.', grade: '9–12. sınıf seviyeleri', status: 'ready', path: '/bilisim/ag',
    topics: ['Fiziksel ağ', 'Switch ve portlar', 'IPv4 ve subnet', 'Router ve ağ geçidi', 'Ping ile hata ayıklama'],
    outcomes: ['Ağ cihazlarını doğru bağlama', 'IP çakışmalarını giderme', 'Farklı ağları router ile haberleştirme', 'Ping sonucunu yorumlama'],
  },
  {
    id: 'yapay-zeka-ml', areaId: 'bilisim', title: 'Yapay Zekâ & ML Laboratuvarı', shortTitle: 'Yapay Zekâ & ML', icon: '🤖',
    description: 'Sınıflandırma, regresyon ve kümeleme gibi temel makine öğrenmesi fikirlerini veri üzerinde dene.', grade: '9–12. sınıf', status: 'planned', path: '/bilisim/yapay-zeka-ml',
    topics: ['Veri', 'Sınıflandırma', 'Regresyon', 'Kümeleme', 'Model değerlendirme'],
    outcomes: ['Problem türünü tanıma', 'Uygun algoritma yaklaşımını seçme', 'Model sonucunu yorumlama'],
  },
  {
    id: 'donanim', areaId: 'bilisim', title: 'Bilgisayar Donanımı Laboratuvarı', shortTitle: 'Bilgisayar Donanımı', icon: '🖥️',
    description: 'Bilgisayar parçalarını tanı, doğru yuvalara yerleştir ve sanal bir sistem topla.', grade: '9. sınıf', status: 'planned', path: '/bilisim/donanim',
    topics: ['Anakart', 'CPU', 'RAM', 'Depolama', 'Güç kaynağı'],
    outcomes: ['Temel bileşenleri tanıma', 'Uyumluluğu değerlendirme', 'Doğru montaj sırasını kavrama'],
  },
  {
    id: 'temel-devreler', areaId: 'elektrik-elektronik', title: 'Temel Devreler Laboratuvarı', shortTitle: 'Temel Devreler', icon: '🔋',
    description: 'Gerilim, akım ve direnç ilişkisini sanal devre kurarak ve değerleri değiştirerek gözlemle.', grade: '9. sınıf', status: 'planned', path: '/elektrik-elektronik/temel-devreler',
    topics: ['Ohm Kanunu', 'Seri devre', 'Paralel devre', 'Kirchhoff'],
    outcomes: ['Devre kurma', 'V-I-R ilişkisini yorumlama', 'Seri/paralel farkını gözlemleme'],
  },
  {
    id: 'olcu-aletleri', areaId: 'elektrik-elektronik', title: 'Ölçü Aletleri Laboratuvarı', shortTitle: 'Ölçü Aletleri', icon: '🎛️',
    description: 'Multimetre, voltmetre ve ampermetre bağlantılarını risksiz biçimde deneyerek öğren.', grade: '9. sınıf', status: 'planned', path: '/elektrik-elektronik/olcu-aletleri',
    topics: ['Multimetre', 'Voltmetre', 'Ampermetre', 'Doğru prob bağlantısı'],
    outcomes: ['Doğru ölçüm türünü seçme', 'Ölçü aletini doğru bağlama', 'Ölçüm sonucunu okuma'],
  },
  {
    id: 'elektronik-elemanlar', areaId: 'elektrik-elektronik', title: 'Elektronik Elemanlar Laboratuvarı', shortTitle: 'Elektronik Elemanlar', icon: '🔧',
    description: 'Direnç, diyot, transistör, kondansatör ve röle gibi elemanların davranışını deneylerle keşfet.', grade: '9–10. sınıf', status: 'planned', path: '/elektrik-elektronik/elektronik-elemanlar',
    topics: ['Direnç', 'Diyot', 'Kondansatör', 'Transistör', 'Röle'],
    outcomes: ['Elemanları tanıma', 'Devredeki görevlerini açıklama', 'Temel bağlantıları uygulama'],
  },
  {
    id: 'osiloskop', areaId: 'elektrik-elektronik', title: 'Osiloskop Laboratuvarı', shortTitle: 'Osiloskop', icon: '〰️',
    description: 'Genlik, frekans ve periyot değerlerini değiştir; dalga biçimini anında gözlemle.', grade: '9–10. sınıf', status: 'planned', path: '/elektrik-elektronik/osiloskop',
    topics: ['Genlik', 'Frekans', 'Periyot', 'Dalga şekilleri'],
    outcomes: ['Dalga biçimini okuma', 'Frekans-periyot ilişkisini kurma', 'Ölçek ayarlarını anlama'],
  },
  {
    id: 'sensorler', areaId: 'elektrik-elektronik', title: 'Sensörler Laboratuvarı', shortTitle: 'Sensörler', icon: '🌡️',
    description: 'Sıcaklık, ışık ve diğer fiziksel değişkenleri sensör çıktısına dönüştürerek gözlemle.', grade: '10–11. sınıf', status: 'planned', path: '/elektrik-elektronik/sensorler',
    topics: ['Sıcaklık', 'Işık', 'Basınç', 'Analog sinyal', 'Dijital sinyal'],
    outcomes: ['Sensör türünü seçme', 'Giriş-çıkış ilişkisini yorumlama', 'Eşik tabanlı kontrol kurma'],
  },
  {
    id: 'mikrodenetleyici', areaId: 'elektrik-elektronik', title: 'Mikrodenetleyici Laboratuvarı', shortTitle: 'Mikrodenetleyici', icon: '🧠',
    description: 'LED, buton, sensör ve motorları kodla kontrol ederek donanım-yazılım ilişkisini kur.', grade: '10–12. sınıf', status: 'planned', path: '/elektrik-elektronik/mikrodenetleyici',
    topics: ['Dijital I/O', 'Analog I/O', 'Sensör', 'Motor', 'Seri haberleşme'],
    outcomes: ['Basit kontrol algoritması yazma', 'Giriş ve çıkışları bağlama', 'Kodun fiziksel etkisini gözlemleme'],
  },
  {
    id: 'plc-otomasyon', areaId: 'elektrik-elektronik', title: 'PLC / Otomasyon Laboratuvarı', shortTitle: 'PLC / Otomasyon', icon: '🏭',
    description: 'Sensör, motor ve konveyörleri PLC mantığıyla yönet; sanal fabrika senaryoları çalıştır.', grade: '11–12. sınıf', status: 'planned', path: '/elektrik-elektronik/plc-otomasyon',
    topics: ['PLC I/O', 'Ladder Logic', 'Zamanlayıcı', 'Sayaç', 'Konveyör'],
    outcomes: ['I/O eşleştirme', 'Basit ladder mantığı kurma', 'Otomasyon senaryosunu test etme'],
  },
]

export const labsByArea = (areaId: AreaDefinition['id']) => labs.filter((lab) => lab.areaId === areaId)
export const getArea = (areaId: string) => areas.find((area) => area.id === areaId)
export const getLab = (areaId: string, labId: string) => labs.find((lab) => lab.areaId === areaId && lab.id === labId)
