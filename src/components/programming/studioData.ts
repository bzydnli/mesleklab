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
  exampleSetup: string
  exampleCall: string
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
    exampleSetup: "// ÖRNEK VERİLER — Sayıları değiştirip tekrar çalıştırabilirsin.\nlet ornekAdet = 2;\nconst ornekFiyat = 150;",
    exampleCall: "// FONKSİYONU ÇAĞIR — Örnek değerleri parametrelere gönder.\nconst ornekSonuc = toplamTutar(ornekAdet, ornekFiyat);",
    starter: ['function toplamTutar(adet, fiyat) {', '  // Uygulama şu an tek biletin fiyatını gösteriyor.', '  return fiyat;', '}'].join('\n'),
    hint: 'Fonksiyonun sonucunu `return` ile gönderirsin. Tek bilet fiyatını değil, bilet adedi ile fiyatın çarpımını döndür: `return adet * fiyat;`. JavaScript’te çarpma işareti `*` kullanılır.',
    tests: [
      { label: '2 bilet × 150 TL', args: [2, 150], expected: 300, hint: '`return adet * fiyat;` ile 2 × 150 sonucunun 300 olmasını sağla.' },
      { label: '1 bilet × 200 TL', args: [1, 200], expected: 200, hint: '`return adet * fiyat;` ile 1 × 200 sonucunun 200 olmasını sağla.' },
      { label: '4 bilet × 75 TL', args: [4, 75], expected: 300, hint: 'Sabit sayı kullanma; `return adet * fiyat;` farklı adetlerde de çalışmalı.' },
      { label: '0 bilet', args: [0, 150], expected: 0, hint: 'Adet 0 olduğunda `return adet * fiyat;` sonucu da 0 olur.' },
    ],
  },
  {
    id: 'koltuk', eyebrow: '02 · KARAR ANI', title: 'Koltuk kontrolü',
    topic: 'Karşılaştırma · Koşullar · Sınır durumları',
    story: 'Bilet almak isteyen biri için yeterli koltuk olmayabilir. Uygulama şimdi herkese onay veriyor.',
    mission: 'Adet geçersizse, koltuk yetmiyorsa ve yer varsa üç farklı sonucu üret.',
    takeaway: 'Kod, karşılaştığı duruma göre farklı yollar izleyebilir.',
    functionName: 'kontrolEt',
    exampleSetup: "// ÖRNEK VERİLER — İstenen bilet ve kalan koltuk.\nlet ornekAdet = 4;\nlet ornekKalan = 3;",
    exampleCall: "// FONKSİYONU ÇAĞIR — Farklı değerlerle farklı yanıtları dene.\nconst ornekSonuc = kontrolEt(ornekAdet, ornekKalan);",
    starter: ['function kontrolEt(adet, kalan) {', '  if (adet <= kalan) {', '    return "Onaylandı";', '  }', '', '  return "Onaylandı";', '}'].join('\n'),
    hint: 'Fonksiyon şu üç yanıtı `return` komutuyla ve tırnak içindeki ifadeleri birebir kullanarak üretmeli: ① `adet <= 0` ise `return "Geçersiz adet";` ② `adet > kalan` ise `return "Yetersiz koltuk";` ③ diğer durumlarda `return "Onaylandı";`. Kontrolleri bu sırayla yap; büyük/küçük harf de önemlidir.',
    tests: [
      { label: '2 istek, 5 koltuk', args: [2, 5], expected: 'Onaylandı', hint: 'Bu durumda beklenen metin tam olarak `return "Onaylandı";` sonucudur.' },
      { label: '4 istek, 2 koltuk', args: [4, 2], expected: 'Yetersiz koltuk', hint: 'İstek kalan koltuktan büyük; `return "Yetersiz koltuk";` sonucunu üret.' },
      { label: '3 istek, 3 koltuk', args: [3, 3], expected: 'Onaylandı', hint: 'Adet ve kalan eşitse `return "Onaylandı";` sonucu beklenir.' },
      { label: '0 bilet isteği', args: [0, 8], expected: 'Geçersiz adet', hint: 'Adet 0 ise `return "Geçersiz adet";` sonucunu üret.' },
      { label: 'Negatif bilet', args: [-1, 8], expected: 'Geçersiz adet', hint: 'Adet negatifse de `return "Geçersiz adet";` sonucunu üret.' },
    ],
  },
  {
    id: 'sepet', eyebrow: '03 · YOĞUN GÜN', title: 'Sepeti toparla',
    topic: 'Diziler · Döngüler · Toplama',
    story: 'Müşteri farklı etkinliklerden istediği kadar bilet seçip sepete ekliyor. Uygulamanın sepeti doğru hesaplaması gerekiyor.',
    mission: 'Sağdaki mağazadan en az iki etkinlik ekle, adetlerini ayrı ayrı değiştir ve sepet toplamını hesaplayan kodu düzelt.',
    takeaway: 'Benzer işleri tek tek yazmak yerine bir koleksiyon üzerinde tekrarlayabilirsin.',
    functionName: 'sepetToplami',
    exampleSetup: "// ÖRNEK VERİLER — Dizideki her nesne bir etkinliğin siparişidir.\nconst ornekSiparisler = [\n  { fiyat: 150, adet: 2 },\n  { fiyat: 120, adet: 3 }\n];",
    exampleCall: "// FONKSİYONU ÇAĞIR — Sepet dizisini gönder.\nconst ornekSonuc = sepetToplami(ornekSiparisler);",
    starter: ['function sepetToplami(siparisler) {', '  let toplam = 0;', '', '  for (const siparis of siparisler) {', '    toplam += siparis.fiyat;', '  }', '', '  return toplam;', '}'].join('\n'),
    hint: 'Döngüde her siparişin `fiyat` ve `adet` bilgilerini birlikte kullan. `toplam += siparis.fiyat * siparis.adet;` ile satır tutarını ekle. Döngü bittikten sonra `return toplam;` ile sepetin toplamını gönder.',
    tests: [
      { label: 'İki farklı etkinlik', args: [[{ fiyat: 150, adet: 2 }, { fiyat: 120, adet: 1 }]], expected: 420, hint: 'Döngü içinde `toplam += siparis.fiyat * siparis.adet;` kullan.' },
      { label: 'Üç çeşit bilet', args: [[{ fiyat: 60, adet: 3 }, { fiyat: 100, adet: 2 }, { fiyat: 25, adet: 4 }]], expected: 480, hint: 'Her siparişi dolaş, fiyatını adediyle çarp ve `toplam` değerine ekle.' },
      { label: 'Boş sepet', args: [[]], expected: 0, hint: '`toplam` başlangıçta 0 ise boş dizide döngü çalışmaz ve `return toplam;` 0 döndürür.' },
      { label: 'Tek ürün, çok adet', args: [[{ fiyat: 80, adet: 5 }]], expected: 400, hint: 'Fiyatı tek sefer eklemek yerine `siparis.fiyat * siparis.adet` değerini ekle.' },
    ],
  },
  {
    id: 'indirim', eyebrow: '04 · KAMPANYA', title: 'Öğrenci indirimi',
    topic: 'Mantıksal değer · Koşul · Yüzde hesabı',
    story: 'Yeni kampanyada öğrencilere %20 indirim uygulanacak. Diğer müşteriler normal fiyat ödeyecek.',
    mission: 'Öğrenci seçiliyse tutarı %20 düşür; değilse olduğu gibi bırak.',
    takeaway: 'Aynı fonksiyon, gelen bilgilere göre farklı sonuçlar üretebilir.',
    functionName: 'odemeTutari',
    exampleSetup: "// ÖRNEK VERİLER — true öğrenci, false normal müşteri.\nlet ornekTutar = 300;\nlet ornekOgrenciMi = true;",
    exampleCall: "// FONKSİYONU ÇAĞIR — Tutarı ve öğrenci bilgisini gönder.\nconst ornekSonuc = odemeTutari(ornekTutar, ornekOgrenciMi);",
    starter: ['function odemeTutari(tutar, ogrenciMi) {', '  if (ogrenciMi) {', '    // İndirim henüz devrede değil.', '    return tutar;', '  }', '', '  return tutar;', '}'].join('\n'),
    hint: '`ogrenciMi` doğru (`true`) olduğunda %20 indirim için `return tutar * 0.8;` kullan. Öğrenci değilse (`false`) fiyat değişmemeli: `return tutar;`. Her iki durumda da sonuç sayı olmalı, metin değil.',
    tests: [
      { label: 'Öğrenci: 300 TL', args: [300, true], expected: 240, hint: 'Öğrenciyse `return tutar * 0.8;` ile 300 yerine 240 döndür.' },
      { label: 'Normal: 300 TL', args: [300, false], expected: 300, hint: 'Öğrenci değilse `return tutar;` kullan; 300 değişmemeli.' },
      { label: 'Öğrenci: 125 TL', args: [125, true], expected: 100, hint: '`return tutar * 0.8;` farklı tutarlarla da doğru sonuç verir.' },
      { label: 'Normal: 0 TL', args: [0, false], expected: 0, hint: '`return tutar;` kullan; 0 tutar da 0 olarak dönmeli.' },
    ],
  },
  {
    id: 'rezervasyon', eyebrow: '05 · YAYINA HAZIR', title: 'Rezervasyon motoru',
    topic: 'Nesneler · Veri güncelleme · İş kuralları',
    story: 'Uygulamanın artık bilet satarken kalan koltuk sayısını güncellemesi gerekiyor. Kapasite aşılmamalı.',
    mission: 'Satış olursa kalan koltuğu azalt ve tutarı hesapla. Geçersiz istekte satış oluşturma.',
    takeaway: 'Gerçek yazılımlar yalnızca değer hesaplamaz; bir sistemin durumunu güvenilir biçimde günceller.',
    functionName: 'biletSat',
    exampleSetup: "// ÖRNEK VERİLER — Etkinlik nesnesi ve alınacak bilet sayısı.\nconst ornekEtkinlik = { kalan: 5, fiyat: 150 };\nlet ornekAdet = 2;",
    exampleCall: "// FONKSİYONU ÇAĞIR — Nesneyi ve adedi parametrelere gönder.\nconst ornekSonuc = biletSat(ornekEtkinlik, ornekAdet);",
    starter: ['function biletSat(etkinlik, adet) {', '  // Satış yapılamıyorsa fonksiyon bu return ile biter.', '  if (adet > etkinlik.kalan) {', '    return { basarili: false, kalan: etkinlik.kalan, tutar: 0 };', '  }', '', '  // Geçerli satış: kalan koltuğu azalt, toplam tutarı hesapla.', '  // Burada hâlâ düzeltmen gereken bir hata var.', '  return {', '    basarili: true,', '    kalan: etkinlik.kalan,', '    tutar: etkinlik.fiyat * adet', '  };', '}'].join('\n'),
    hint: 'Önce `adet <= 0` veya `adet > etkinlik.kalan` durumlarını kontrol et. Böyle bir istekte `return { basarili: false, kalan: etkinlik.kalan, tutar: 0 };` kullan. Geçerli satışta `return { basarili: true, kalan: etkinlik.kalan - adet, tutar: etkinlik.fiyat * adet };` sonucunu üret. Özellik adlarını (`basarili`, `kalan`, `tutar`) aynen yaz.',
    tests: [
      { label: '2 bilet sat', args: [{ kalan: 8, fiyat: 150 }, 2], expected: { basarili: true, kalan: 6, tutar: 300 }, hint: 'Başarılı sonuçtaki `kalan` alanını `etkinlik.kalan - adet` olarak hesapla.' },
      { label: 'Son koltuğu sat', args: [{ kalan: 1, fiyat: 200 }, 1], expected: { basarili: true, kalan: 0, tutar: 200 }, hint: 'Adet kalan koltuğa eşitse satış başarılı olmalı ve `kalan: 0` dönmeli.' },
      { label: 'Kapasiteyi aş', args: [{ kalan: 3, fiyat: 100 }, 5], expected: { basarili: false, kalan: 3, tutar: 0 }, hint: 'Yetersiz koltukta `basarili: false`, `kalan: etkinlik.kalan`, `tutar: 0` döndür.' },
      { label: '0 bilet isteği', args: [{ kalan: 10, fiyat: 150 }, 0], expected: { basarili: false, kalan: 10, tutar: 0 }, hint: 'Adet 0 olduğunda da `basarili: false`, `kalan: etkinlik.kalan`, `tutar: 0` döndür.' },
    ],
  },
]

// Öğrenci kodu tek başına okunabilsin: örnek veriler → fonksiyon → çağrı.
// Daha önce kaydedilmiş fonksiyon kodunu silmeden örnek bölümünü ekleriz.
export function completeStudioSource(chapter: StudioChapter, code: string): string {
  if (code.includes('// ÖRNEK VERİLER')) return code
  return [chapter.exampleSetup, '', code, '', chapter.exampleCall].join('\n')
}
