import { Link, Navigate, useParams } from 'react-router-dom'
import { getArea, labsByArea } from '../data/labs'
import { LabCard } from '../components/LabCard'

export function AreaPage() {
  const { areaId = '' } = useParams()
  const area = getArea(areaId)

  if (!area) return <Navigate to="/404" replace />
  const areaLabs = labsByArea(area.id)

  return (
    <div className="page-width area-page">
      <div className="breadcrumbs"><Link to="/">MeslekLab</Link><span>/</span><span>{area.title}</span></div>
      <section className={`area-hero area-hero-${area.accent}`}>
        <div>
          <span className="kicker">{area.eyebrow}</span>
          <h1><span className="area-title-icon">{area.icon}</span>{area.title}</h1>
          <p>{area.description}</p>
        </div>
        <div className="area-stat">
          <strong>{areaLabs.length}</strong>
          <span>laboratuvar</span>
        </div>
      </section>

      <section className="section compact">
        <div className="section-heading row-heading">
          <div>
            <span className="kicker">LABORATUVARLAR</span>
            <h2>Bir modül seç.</h2>
          </div>
          <p>Şimdilik altyapı hazır. Modülleri bundan sonra tek tek gerçek playgroundlara dönüştüreceğiz.</p>
        </div>
        <div className="labs-grid">
          {areaLabs.map((lab) => <LabCard lab={lab} key={lab.id} />)}
        </div>
      </section>
    </div>
  )
}
