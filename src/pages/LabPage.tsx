import { Link, Navigate, useParams } from 'react-router-dom'
import { getArea, getLab } from '../data/labs'
import { StatusBadge } from '../components/StatusBadge'
import { AlgorithmLab } from '../components/algorithm/AlgorithmLab'

export function LabPage() {
  const { areaId = '', labId = '' } = useParams()
  const area = getArea(areaId)
  const lab = getLab(areaId, labId)

  if (!area || !lab) return <Navigate to="/404" replace />

  const isAlgorithmLab = areaId === 'bilisim' && labId === 'algoritma'

  return (
    <div className="page-width lab-page">
      <div className="breadcrumbs">
        <Link to="/">MeslekLab</Link><span>/</span><Link to={area.path}>{area.title}</Link><span>/</span><span>{lab.shortTitle}</span>
      </div>

      <section className="lab-hero">
        <div className="lab-hero-icon">{lab.icon}</div>
        <div className="lab-hero-copy">
          <div className="lab-meta"><StatusBadge status={lab.status} /><span>{lab.grade}</span></div>
          <h1>{lab.title}</h1>
          <p>{lab.description}</p>
        </div>
      </section>

      <div className="lab-layout">
        <section className="lab-main-panel">
          {isAlgorithmLab ? (
            <AlgorithmLab />
          ) : (
            <div className="placeholder-stage">
              <div className="placeholder-toolbar">
                <span></span><span></span><span></span>
                <b>MeslekLab / {lab.shortTitle}</b>
              </div>
              <div className="placeholder-content">
                <span className="placeholder-icon">{lab.icon}</span>
                <h2>Playground alanı hazır.</h2>
                <p>Bu ekran, bu laboratuvarın gerçek simülasyonu geliştirildiğinde çalışma alanına dönüşecek.</p>
                <div className="fake-controls"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
        </section>

        <aside className="lab-sidebar">
          <div className="info-card">
            <span className="kicker">KONU BAŞLIKLARI</span>
            <div className="chips">{lab.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
          </div>
          <div className="info-card">
            <span className="kicker">ÖĞRENME HEDEFLERİ</span>
            <ul>{lab.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </aside>
      </div>

      {!isAlgorithmLab && (
        <section className="module-blueprint">
          <div className="section-heading">
            <span className="kicker">BU MODÜLÜ NASIL GELİŞTİRECEĞİZ?</span>
            <h2>Tek bir sayfa değil, öğretici bir deney.</h2>
          </div>
          <div className="blueprint-grid">
            <article><b>1</b><h3>Kısa anlatım</h3><p>Öğrenci deneyden önce yalnızca ihtiyaç duyduğu kadar temel bilgi görür.</p></article>
            <article><b>2</b><h3>İnteraktif deney</h3><p>Değerleri değiştirir, parçaları taşır veya kodu çalıştırır; sonucu anında görür.</p></article>
            <article><b>3</b><h3>Neden oldu?</h3><p>Sistem sadece doğru/yanlış demez; sonucun nedenini sade biçimde açıklar.</p></article>
            <article><b>4</b><h3>Mini görev</h3><p>Konu, küçük bir gerçek hayat problemiyle pekiştirilir.</p></article>
          </div>
        </section>
      )}
    </div>
  )
}
