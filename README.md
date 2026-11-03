# MeslekLab

MeslekLab, mesleki ve teknik lise öğrencilerinin konuları yalnızca okuyarak değil; **deneyerek, değiştirerek ve sonucu gözlemleyerek** öğrenmesi için tasarlanan interaktif bir öğrenme laboratuvarıdır.

Bu depo MeslekLab'ın ana uygulamasıdır. İlk aşamada Bilişim Teknolojileri ve Elektrik-Elektronik Teknolojisi alanlarının sayfa/rota altyapısı hazırlanmıştır. Laboratuvarlar daha sonra tek tek gerçek simülasyon ve playground modülleriyle geliştirilecektir.

## Alanlar

### 💻 Bilişim Teknolojileri

- Algoritma Laboratuvarı
- Programlama Laboratuvarı
- Ağ Laboratuvarı
- Yapay Zekâ & ML
- Bilgisayar Donanımı

### ⚡ Elektrik-Elektronik

- Temel Devreler
- Ölçü Aletleri
- Elektronik Elemanlar
- Osiloskop
- Sensörler
- Mikrodenetleyici
- PLC / Otomasyon

## Teknoloji

- React
- TypeScript
- Vite
- React Router

## Yerelde çalıştırma

Bilgisayarında Node.js kurulu olmalıdır.

```bash
npm install
npm run dev
```

Ardından terminalde gösterilen yerel adresi tarayıcıda aç.

## Proje yapısı

```text
src/
├── components/       # Ortak arayüz bileşenleri
├── data/             # Alan ve laboratuvar tanımları
├── pages/            # Ana sayfa, alan ve laboratuvar sayfaları
├── App.tsx           # Rotalar
├── main.tsx          # Uygulama başlangıcı
├── styles.css        # Ortak tasarım sistemi
└── types.ts          # TypeScript tipleri
```

Laboratuvarların menü bilgileri `src/data/labs.ts` içerisinde merkezi olarak tutulur. Yeni bir laboratuvar eklemek için uygulamanın farklı yerlerinde aynı kartları ve rotaları tekrar tekrar yazmak yerine bu veri yapısı genişletilir.

## Geliştirme yaklaşımı

Her laboratuvar aynı öğretme döngüsünü hedefler:

**Bu nedir? → Neden kullanıyoruz? → Sen değiştir → Ne oldu? → Neden böyle oldu? → Mini görev → Gerçek hayat bağlantısı**

İlk gerçek modül adayı: **Temel Devreler Laboratuvarı**.
