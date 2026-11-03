export type AlgorithmModuleId = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'FINAL'

export type AlgorithmModuleDefinition = {
  id: AlgorithmModuleId
  title: string
  eyebrow: string
  lesson: string
  playground: string
  exercises: string[]
  successCriteria: string[]
  status: 'live' | 'ready'
}

export const algorithmModules: AlgorithmModuleDefinition[] = [
  {
    id: 'A1',
    title: 'Algoritmaya Giriş',
    eyebrow: 'Problem · çözüm · adım · sıra',
    lesson: 'Algoritmanın bir problemi çözmek için izlenen açık ve sıralı adımlar bütünü olduğunu günlük yaşam örnekleriyle sezdirir. Öğrenci henüz kod görmez; önce doğru sıra ve bağımlılık ilişkisini fark eder.',
    playground: 'Karışık verilen günlük yaşam adımlarını yukarı-aşağı taşıyarak doğru sıraya getirir. Sistem yalnızca doğru/yanlış demez; yanlış sıradaki ilk bağımlılığı açıklayan ipucu verir.',
    exercises: [
      'Tost hazırlama adımlarını sırala.',
      'Çay hazırlama adımlarını sırala.',
      'Bilgisayarı açıp bir belge oluşturma adımlarını sırala.',
      'Bir e-postaya dosya ekleyip gönderme adımlarını sırala.',
      'Okula hazırlanma adımlarını mantıklı sıraya koy.',
      'Fotokopi çekme sürecindeki adımları sırala.',
      'Bir dosyayı kaydedip kapatma sürecindeki eksik adımı bul.',
    ],
    successCriteria: [
      'Sıralama görevini hatasız tamamlar.',
      'Bir adımın neden önce/sonra gelmesi gerektiğini açıklayabilir.',
      '3 kısa kontrol sorusunun en az 2 tanesini doğru cevaplar.',
    ],
    status: 'live',
  },
  {
    id: 'A2',
    title: 'Problem Analizi',
    eyebrow: 'Girdi → İşlem → Çıktı',
    lesson: 'Bir problem çözülmeden önce eldeki bilgilerin, uygulanacak işlemin ve üretilecek sonucun ayrıştırılması öğretilir. Amaç öğrencinin doğrudan çözüme atlamak yerine problemi yapılandırmasıdır.',
    playground: 'Verilen problem kartındaki ifadeleri Girdi, İşlem ve Çıktı alanlarına sürükler veya seçeneklerden seçer. Yanlış cevapta sistem hangi parçanın neden yanlış sınıflandığını açıklar.',
    exercises: [
      'İki sayının toplamını bulma.',
      'Dikdörtgenin alanını hesaplama.',
      'Dikdörtgenin çevresini hesaplama.',
      'Üç sınav notunun ortalamasını bulma.',
      'Kilometreyi metreye çevirme.',
      'Saati dakikaya çevirme.',
      'Ürün adedi ve fiyatından toplam tutarı bulma.',
      'Yakıt miktarı ve litre fiyatından maliyeti hesaplama.',
    ],
    successCriteria: [
      'En az 6 problemin 5 tanesinde girdi-işlem-çıktıyı doğru ayırır.',
      'Girdi ile çıktıyı birbirine karıştırmaz.',
      'İşlemi doğal dille doğru ifade eder.',
    ],
    status: 'ready',
  },
  {
    id: 'A3',
    title: 'İyi Algoritmanın Özellikleri',
    eyebrow: 'Açık · uygulanabilir · sonlu · sonuç üreten',
    lesson: 'Her sıralı listenin iyi bir algoritma olmadığı gösterilir. Adımların açık, uygulanabilir, doğru sırada, sonlu ve sonuç üreten nitelikte olması gerektiği örnek/karşı örneklerle öğretilir.',
    playground: 'İki algoritmayı karşılaştırır; belirsiz, eksik, gereksiz veya yanlış sıradaki adımı işaretler. Sonsuz veya sonuç üretmeyen örnekleri ayırt eder.',
    exercises: [
      'Belirsiz komutu bul: “Biraz sayı al.”',
      'Eksik adımı bul: girdi almadan hesaplama.',
      'Gereksiz adımı işaretle.',
      'Yanlış sıradaki adımı düzelt.',
      'Sonu olmayan algoritmayı fark et.',
      'Sonuç üretmeyen algoritmayı fark et.',
      'İki çözümden daha açık olanı seç ve nedenini belirt.',
    ],
    successCriteria: [
      '5 temel kalite özelliğini tanır.',
      '6 hata örneğinin en az 5 tanesini doğru sınıflandırır.',
      'Bir algoritmanın neden uygulanabilir olmadığını açıklayabilir.',
    ],
    status: 'ready',
  },
  {
    id: 'A4',
    title: 'Doğrusal Algoritmalar',
    eyebrow: 'Başla → Girdi → İşlem → Çıktı → Bitir',
    lesson: 'Koşul ve döngü kullanmadan, adımların tek yönde ilerlediği doğrusal algoritmalar kurulur. Öğrenci gerçek problemlerde işlem sırasını ve veri bağımlılığını pekiştirir.',
    playground: 'Bir problem seçilir, gerekli algoritma adımları karışık olarak gelir. Öğrenci adımları doğru sıraya dizer ve çalıştırmadan önce sonucunu tahmin eder.',
    exercises: [
      'İki sayının toplamı.',
      'Dikdörtgen alanı.',
      'Dikdörtgen çevresi.',
      'Üç notun ortalaması.',
      'Celsius değerini Fahrenheit değerine dönüştürme.',
      'Saat değerini dakikaya dönüştürme.',
      'Ürün adedi × ürün fiyatı.',
      'Yol = hız × zaman.',
    ],
    successCriteria: [
      'En az 6 doğrusal algoritmadan 5 tanesini doğru kurar.',
      'Bir işlemde kullanılan girdilerin işlemden önce alınması gerektiğini uygular.',
      'Başla/Bitir ve çıktı adımlarını unutmaz.',
    ],
    status: 'ready',
  },
  {
    id: 'A5',
    title: 'Sözde Kod',
    eyebrow: 'Doğal dilden programlama mantığına köprü',
    lesson: 'Algoritma adımları BAŞLA, değer al, hesapla, göster ve BİTİR gibi düzenli sözde kod ifadelerine dönüştürülür. Belirli bir programlama dilinin sözdizimine girilmez.',
    playground: 'Önce bloklardan sözde kod kurulur; sonraki görevlerde bazı satırlar öğrenci tarafından tamamlanır. Sistem işlem ve sıra hatalarında satır bazlı geri bildirim verir.',
    exercises: [
      'İki sayının toplamı için sözde kod.',
      'Dikdörtgen alanı için sözde kod.',
      'Dikdörtgen çevresi için sözde kod.',
      'Üç notun ortalaması için sözde kod.',
      'Saat-dakika dönüşümü için sözde kod.',
      'Toplam ürün fiyatı için sözde kod.',
      'Yol hesabı için eksik sözde kod satırını tamamlama.',
    ],
    successCriteria: [
      'BAŞLA ve BİTİR sınırlarını doğru kullanır.',
      'Girdi, işlem ve çıktıyı sözde kodda doğru sıraya koyar.',
      '5 görevden en az 4 tanesini yardım almadan tamamlar.',
    ],
    status: 'ready',
  },
  {
    id: 'A6',
    title: 'Adım Adım Çalıştırıcı',
    eyebrow: 'Algoritmanın bellekteki izini gör',
    lesson: 'Bir algoritmanın tek seferde “sonuç üretmediği”, her adımda değerlerin oluştuğu ve değiştiği görselleştirilir. Bu mekanizma ileride Python öğrenirken de tekrar kullanılacaktır.',
    playground: 'Öğrenci İleri düğmesine bastıkça aktif satır vurgulanır; sağdaki bellek panelinde hangi değişkenin hangi değeri aldığı gösterilir. Çıktı yalnızca ilgili adıma gelindiğinde görünür.',
    exercises: [
      'a=5, b=3 için toplam algoritmasını izle.',
      'Dikdörtgen alanında kısa/uzun/alan değerlerini izle.',
      'Üç not ortalamasında ara toplamı izle.',
      'Saat-dakika dönüşümünde değerin değişimini izle.',
      'Ürün toplam fiyatında adet ve fiyatı değiştirerek sonucu tahmin et.',
      'Yol hesabında farklı hız ve zaman değerlerini dene.',
    ],
    successCriteria: [
      'Bir satır çalışmadan önce sonucu tahmin eder.',
      'Değerin hangi adımda oluştuğunu doğru gösterir.',
      'En az 4 çalışma izini hatasız tamamlar.',
    ],
    status: 'ready',
  },
  {
    id: 'A7',
    title: 'Akış Şeması Sembolleri',
    eyebrow: 'Sembol ile görev eşleştirme',
    lesson: 'Başla/Bitir, veri giriş-çıkışı, işlem, karar ve akış yönü sembolleri tanıtılır. Karar sembolü burada yalnızca tanınır; v1 içinde koşullu algoritma kurulmaz.',
    playground: 'Sembol kartı ile görevi eşleştir, ardından kısa bir akıştaki yanlış sembolü bul. Sistem şeklin anlamını görsel ipucuyla açıklar.',
    exercises: [
      'Oval sembolünü Başla/Bitir ile eşleştir.',
      'Paralelkenarı veri giriş/çıkışı ile eşleştir.',
      'Dikdörtgeni işlem ile eşleştir.',
      'Elması karar ile eşleştir.',
      'Oku akış yönü ile eşleştir.',
      'Yanlış sembolle çizilmiş “Alanı hesapla” adımını düzelt.',
      'Kısa bir akış şemasındaki iki sembol hatasını bul.',
    ],
    successCriteria: [
      '5 temel sembolün görevini hatasız eşleştirir.',
      'Bir adım için uygun sembolü seçebilir.',
      'Karar sembolünü tanır ancak koşullu yapı kurmaya başlamaz.',
    ],
    status: 'ready',
  },
  {
    id: 'A8',
    title: 'Akış Şeması Kurucu',
    eyebrow: 'Algoritmayı görsel akışa dönüştür',
    lesson: 'Metinsel veya sözde kod olarak hazırlanmış doğrusal algoritmalar, standart akış şeması sembolleriyle görsel hâle getirilir. Sembol seçimi kadar bağlantı sırası da önemlidir.',
    playground: 'Sol paletten Başla, Veri al, İşlem, Çıktı ve Bitir blokları çalışma alanına eklenir; bloklar bağlanır. Çalıştır düğmesi akışı adım adım vurgular.',
    exercises: [
      'İki sayının toplamı akış şeması.',
      'Dikdörtgen alanı akış şeması.',
      'Dikdörtgen çevresi akış şeması.',
      'Üç not ortalaması akış şeması.',
      'Saat-dakika dönüşümü akış şeması.',
      'Ürün toplam fiyatı akış şeması.',
      'Yol hesabı akış şeması.',
    ],
    successCriteria: [
      'Blokların sembol türlerini doğru seçer.',
      'Bağlantıları doğru sırada kurar.',
      'En az 4 akış şemasını yardım almadan tamamlar.',
    ],
    status: 'ready',
  },
  {
    id: 'A9',
    title: 'Hata Avcısı',
    eyebrow: 'Yanlış algoritmayı incele · düzelt · açıkla',
    lesson: 'Öğrenci sıfırdan algoritma yazmak yerine hatalı örnekleri inceler. Amaç yalnızca hatayı düzeltmek değil, hatanın neden problem oluşturduğunu açıklayabilmektir.',
    playground: 'Hatalı algoritmada sorunlu satır seçilir, hata türü belirlenir ve doğru konuma/ifadeye dönüştürülür. Sistem doğrudan cevabı vermeden bağımlılık ve amaç ipuçları sunar.',
    exercises: [
      'Eksik girdi hatasını bul.',
      'Yanlış işlem/formül hatasını bul.',
      'Yanlış sıra hatasını düzelt.',
      'Gereksiz adımı kaldır.',
      'Unutulan çıktı adımını ekle.',
      'Eksik Bitir adımını fark et.',
      'Belirsiz komutu daha açık yaz.',
      'Hesaplama girdilerden önce yapılıyorsa düzelt.',
    ],
    successCriteria: [
      '8 hata örneğinin en az 6 tanesini doğru bulur.',
      'Hata türünü doğru adlandırır.',
      'Düzeltmenin neden gerekli olduğunu bir cümleyle açıklayabilir.',
    ],
    status: 'ready',
  },
  {
    id: 'FINAL',
    title: 'Final Görevi',
    eyebrow: 'Analiz et → algoritmayı kur → test et → akış şemasına dönüştür',
    lesson: 'Öğrenciye hazır algoritma verilmez. Önce problemi analiz eder, sonra çözüm adımlarını ve sözde kodu kurar, farklı değerlerle test eder ve doğrusal akış şemasını tamamlar.',
    playground: 'Ana görev üç sınav notunun ortalamasını hesaplayıp göstermektir. Sistem süreci aşamalı rubric ile değerlendirir; yalnızca sonuca değil problem analizi, sıra, test ve şemaya puan verir.',
    exercises: [
      'Ana görev: Üç sınav notunun ortalamasını hesapla ve göster.',
      'Ek görev: Alışveriş toplam tutarını hesapla.',
      'Ek görev: Hız ve zamandan yolu hesapla.',
    ],
    successCriteria: [
      'Girdi-işlem-çıktı analizi doğru.',
      'Algoritma ve sözde kod doğru sırada.',
      'En az iki farklı veri setiyle test başarılı.',
      'Akış şeması doğru sembol ve bağlantılardan oluşuyor.',
      'Toplam rubric puanı en az %80.',
    ],
    status: 'ready',
  },
]

export const getAlgorithmModule = (id: AlgorithmModuleId) => algorithmModules.find((module) => module.id === id)

export const algorithmScopeNote = 'Algoritma Laboratuvarı v1 doğrusal algoritmalarla sınırlıdır. Karar ve döngü sembolleri/örnekleri MEB ders materyalinde aynı öğrenme biriminde yer alsa da koşullu ve döngülü algoritmalar MeslekLab içinde sonraki program akışı modüllerinde derinleştirilecektir.'
