export type AreaId = 'bilisim' | 'elektrik-elektronik'

export type LabStatus = 'foundation' | 'planned' | 'ready'

export interface LabDefinition {
  id: string
  areaId: AreaId
  title: string
  shortTitle: string
  icon: string
  description: string
  grade: string
  status: LabStatus
  path: string
  topics: string[]
  outcomes: string[]
}

export interface AreaDefinition {
  id: AreaId
  title: string
  icon: string
  eyebrow: string
  description: string
  path: string
  accent: 'blue' | 'amber'
}
