export type TestCase = {
  label: string
  args: unknown[]
  expected: unknown
  hint: string
}

export type StudioChapter = {
  id: string
  eyebrow: string
  title: string
  topic: string
  story: string
  mission: string
  takeaway: string
  functionName: string
  starter: string
  hint: string
  tests: TestCase[]
}

export const studioChapters: StudioChapter[] = [
  {
    id: 'fiyat', eyebrow: '01 · İLK ÖZELLİK', title: 'Fiyat hesaplayıcı',
    topic: 'Değişkenler · İşlemler · Fonksiyonlar',
    story: 'İlk müşterin iki bilet almak istiyor ama uygulama yalnızca tek biletin fiyatını gösteriyor.',
    mission: 'Toplam tutarı bilet adediyle birlikte değişecek şekilde düzelt.',
    takeaway: 'Bir fonksiyon bilgiyi alır, üzerinde işlem yapar ve yeni bir sonuç üretir.',
    functionName: 'toplamTutar',
    starter: ['function toplamTutar(adet, fiyat) {', '  // Uygulama şu an tek biletin fiyatını gösteriyor.', '  return fiyat;', '}'].join('\n'),
    hint: 'Tek bir biletin fiyatını değil, adet × fiyat sonucunu döndürmelisin. JavaScript’te çarpma işareti * kullanılır.',
    tests: [
      { label: '2 bilet × 150 TL', args: [2, 150], expected: 300, hint: 'İki bilet için fiyat iki katına çıkmalı.' },
      { label: '1 bilet × 200 TL', args: [1, 200], expected: 200, hint: 'Bir biletin tutarı tek bilet fiyatına eşit.' },
      { label: '4 bilet × 75 TL', args: [4, 75], expected: 300, hint: 'Adet değişse de aynı hesaplama çalışmalı.' },
      { label: '0 bilet', args: [0, 150], expected: 0, hint: 'Bilet seçilmediyse toplam sıfır olmalı.' },
    ],
  },
  {
    id: 'koltuk', eyebrow: '02 · KARAR ANI', title: 'Koltuk kontrolü',
    topic: 'Karşılaştırma · Koşullar · Sınır durumları',
    story: 'Bilet almak isteyen biri için yeterli koltuk olmayabilir. Uygulama şimdi herkese onay veriyor.',
    mission: 'Adet geçersizse, koltuk yetmiyorsa ve yer varsa üç farklı sonucu üret.',
    takeaway: 'Kod, karşılaştığı duruma göre farklı yollar izleyebilir.',
    functionName: 'kontrolEt',
    starter: ['function kontrolEt(adet, kalan) {', '  if (adet <= kalan) {', '    return "Onaylandı";', '  }', '', '  return "Onaylandı";', '}'].join('\n'),
    hint: 'Önce adet 0 veya daha küçük mü diye bak. Sonra adet kalan koltuktan fazlaysa "Yetersiz koltuk", diğer durumda "Onaylandı" döndür.',
    tests: [
      { label: '2 istek, 5 koltuk', args: [2, 5], expected: 'Onaylandı', hint: 'Yeterli yer varsa onaylamalısın.' },
      { label: '4 istek, 2 koltuk', args: [4, 2], expected: 'Yetersiz koltuk', hint: 'İstenen sayı mevcut koltuktan fazla.' },
      { label: '3 istek, 3 koltuk', args: [3, 3], expected: 'Onaylandı', hint: 'Tam kapasite de kabul edilebilir.' },
      { label: '0 bilet isteği', args: [0, 8], expected: 'Geçersiz adet', hint: 'Hiç bilet istemek geçerli bir rezervasyon değil.' },
      { label: 'Negatif bilet', args: [-1, 8], expected: 'Geçersiz adet', hint: 'Negatif bir miktar sipariş edilemez.' },
    ],
  },
  {
    id: 'sepet', eyebrow: '03 · YOĞUN GÜN', title: 'Sepeti toparla',
    topic: 'Diziler · Döngüler · Toplama',
    story: 'Müşteriler aynı anda farklı etkinliklerden bilet seçiyor. Sepet toplamı yanlış hesaplanıyor.',
    mission: 'Sepetteki her ürünü ve adedini hesaba katarak doğru toplamı oluştur.',
    takeaway: 'Benzer işleri tek tek yazmak yerine bir koleksiyon üzerinde tekrarlayabilirsin.',
    functionName: 'sepetToplami',
    starter: ['function sepetToplami(siparisler) {', '  let toplam = 0;', '', '  for (const siparis of siparisler) {', '    toplam += siparis.fiyat;', '  }', '', '  return toplam;', '}'].join('\n'),
    hint: 'Döngü doğru yerde. Ama her sipariş için yalnızca fiyatı ekliyorsun; siparis.adet değerini de kullan.',
    tests: [
      { label: 'İki farklı etkinlik', args: [[{ fiyat: 150, adet: 2 }, { fiyat: 120, adet: 1 }]], expected: 420, hint: 'Her satırda fiyat × adet hesaplanmalı.' },
      { label: 'Üç çeşit bilet', args: [[{ fiyat: 60, adet: 3 }, { fiyat: 100, adet: 2 }, { fiyat: 25, adet: 4 }]], expected: 480, hint: 'Listedeki bütün satırları toplamalısın.' },
      { label: 'Boş sepet', args: [[]], expected: 0, hint: 'Listede hiçbir ürün yoksa toplam 0.' },
      { label: 'Tek ürün, çok adet', args: [[{ fiyat: 80, adet: 5 }]], expected: 400, hint: 'Aynı ürünün adetini unutma.' },
    ],
  },
  {
    id: 'indirim', eyebrow: '04 · KAMPANYA', title: 'Öğrenci indirimi',
    topic: 'Mantıksal değer · Koşul · Yüzde hesabı',
    story: 'Yeni kampanyada öğrencilere %20 indirim uygulanacak. Diğer müşteriler normal fiyat ödeyecek.',
    mission: 'Öğrenci seçiliyse tutarı %20 düşür; değilse olduğu gibi bırak.',
    takeaway: 'Aynı fonksiyon, gelen bilgilere göre farklı sonuçlar üretebilir.',
    functionName: 'odemeTutari',
    starter: ['function odemeTutari(tutar, ogrenciMi) {', '  if (ogrenciMi) {', '    // İndirim henüz devrede değil.', '    return tutar;', '  }', '', '  return tutar;', '}'].join('\n'),
    hint: '%20 indirim demek tutarın %80’ini ödemek demektir. Yalnızca ogrenciMi doğru olduğunda tutar * 0.8 döndür.',
    tests: [
      { label: 'Öğrenci: 300 TL', args: [300, true], expected: 240, hint: 'Öğrenci %20 daha az ödemeli.' },
      { label: 'Normal: 300 TL', args: [300, false], expected: 300, hint: 'Öğrenci olmayan tam tutar öder.' },
      { label: 'Öğrenci: 125 TL', args: [125, true], expected: 100, hint: 'Başka tutarlarda da indirim geçerli.' },
      { label: 'Normal: 0 TL', args: [0, false], expected: 0, hint: 'Sıfır tutarın sonucu da sıfırdır.' },
    ],
  },
  {
    id: 'rezervasyon', eyebrow: '05 · YAYINA HAZIR', title: 'Rezervasyon motoru',
    topic: 'Nesneler · Veri güncelleme · İş kuralları',
    story: 'Uygulamanın artık bilet satarken kalan koltuk sayısını güncellemesi gerekiyor. Kapasite aşılmamalı.',
    mission: 'Satış olursa kalan koltuğu azalt ve tutarı hesapla. Geçersiz istekte satış oluşturma.',
    takeaway: 'Gerçek yazılımlar yalnızca değer hesaplamaz; bir sistemin durumunu güvenilir biçimde günceller.',
    functionName: 'biletSat',
    starter: ['function biletSat(etkinlik, adet) {', '  if (adet > etkinlik.kalan) {', '    return { basarili: false, kalan: etkinlik.kalan, tutar: 0 };', '  }', '', '  return {', '    basarili: true,', '    kalan: etkinlik.kalan,', '    tutar: etkinlik.fiyat * adet', '  };', '}'].join('\n'),
    hint: 'Başarılı satışta kalan = etkinlik.kalan - adet olmalı. Ayrıca 0 veya negatif adet, koltuk yetmese de geçersizdir.',
    tests: [
      { label: '2 bilet sat', args: [{ kalan: 8, fiyat: 150 }, 2], expected: { basarili: true, kalan: 6, tutar: 300 }, hint: 'Satış gerçekleşince kalan koltuk azalmalı.' },
      { label: 'Son koltuğu sat', args: [{ kalan: 1, fiyat: 200 }, 1], expected: { basarili: true, kalan: 0, tutar: 200 }, hint: 'Son koltuk da satılabilir.' },
      { label: 'Kapasiteyi aş', args: [{ kalan: 3, fiyat: 100 }, 5], expected: { basarili: false, kalan: 3, tutar: 0 }, hint: 'Satış reddedilirse koltuk sayısı değişmemeli.' },
      { label: '0 bilet isteği', args: [{ kalan: 10, fiyat: 150 }, 0], expected: { basarili: false, kalan: 10, tutar: 0 }, hint: 'Geçersiz adet için başarılı satış oluşturma.' },
    ],
  },
]
