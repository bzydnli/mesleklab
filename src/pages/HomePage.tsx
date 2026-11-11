import { Link } from 'react-router-dom'
import { areas, labsByArea } from '../data/labs'

export function HomePage() {
  return (
    <>
      <section className="hero page-width">
        <div className="hero-copy">
          <span className="kicker">MESLEKİ EĞİTİM · ETKİLEŞİMLİ LABORATUVAR</span>
          <h1>Bilgiyi <span>deneyime dönüştür.</span></h1>
          <p>
            MeslekLab'da bilişim ve elektrik-elektronik konularını etkileşimli deneyler
            ve simülasyonlarla keşfet. Kavramları öğren, kendi denemelerini yap,
            sonuçları gözlemle ve öğrendiklerini uygulamaya dönüştür.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#alanlar">Alanları keşfet</a>
            <span className="microcopy">2 alan · 12 laboratuvar</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="hero-node node-code">&lt;/&gt;</div>
          <div className="hero-node node-circuit">⚡</div>
          <div className="hero-node node-ai">AI</div>
          <div className="hero-center">ML</div>
        </div>
      </section>

      <section id="alanlar" className="section page-width">
        <div className="section-heading">
          <span className="kicker">ALANINI SEÇ</span>
          <h2>Ne öğrenmek istiyorsun?</h2>
          <p>Her alan kendi laboratuvarlarına ayrılır.</p>
        </div>

        <div className="area-grid">
          {areas.map((area) => (
            <Link key={area.id} to={area.path} className={`area-card area-${area.accent}`}>
              <div className="area-card-head">
                <span className="area-icon">{area.icon}</span>
                <span>{area.eyebrow}</span>
              </div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <div className="area-lab-list">
                {labsByArea(area.id).map((lab) => <span key={lab.id}>{lab.icon} {lab.shortTitle}</span>)}
              </div>
              <strong>{labsByArea(area.id).length} laboratuvar →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="learning-model">
        <div className="page-width learning-grid">
          <div>
            <span className="kicker">MESLEKLAB YAKLAŞIMI</span>
            <h2>Her modül aynı öğrenme döngüsünü kullanır.</h2>
          </div>
          <div className="steps">
            <div><b>01</b><span><strong>Öğren</strong> Kavramı kısa ve sade biçimde tanı.</span></div>
            <div><b>02</b><span><strong>Dene</strong> Değerleri değiştir, bağlantı kur, sonucu gör.</span></div>
            <div><b>03</b><span><strong>Anla</strong> Sistem sana neden öyle olduğunu açıklasın.</span></div>
            <div><b>04</b><span><strong>Görev</strong> Küçük bir gerçek hayat problemi çöz.</span></div>
          </div>
        </div>
      </section>
    </>
  )
}
