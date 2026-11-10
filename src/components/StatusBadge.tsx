import type { LabStatus } from '../types'

const labels: Record<LabStatus, string> = {
  planned: 'Planlandı',
  ready: 'Hazır',
}

export function StatusBadge({ status }: { status: LabStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>
}
