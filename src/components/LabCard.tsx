import { Link } from 'react-router-dom'
import type { LabDefinition } from '../types'
import { StatusBadge } from './StatusBadge'

export function LabCard({ lab }: { lab: LabDefinition }) {
  return (
    <Link className="lab-card" to={lab.path}>
      <div className="lab-card-top">
        <span className="lab-icon">{lab.icon}</span>
        <StatusBadge status={lab.status} />
      </div>
      <div>
        <p className="lab-grade">{lab.grade}</p>
        <h3>{lab.shortTitle}</h3>
        <p>{lab.description}</p>
      </div>
      <div className="topic-row">
        {lab.topics.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}
      </div>
      <span className="card-arrow">Laboratuvara gir →</span>
    </Link>
  )
}
