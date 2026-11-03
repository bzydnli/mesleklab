import type { LabStatus } from '../types'

const labels: Record<LabStatus, string> = {
  foundation: 'İlk geliştirilecek',
  planned: 'Planlandı',
  ready: 'Hazır',
}

export function StatusBadge({ status }: { status: LabStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>
}
