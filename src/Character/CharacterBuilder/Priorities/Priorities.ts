import { Metatypes } from '../../Metatype'

export enum PriorityStat {
  metatype = 'metatype',
  attributes = 'attributes',
  skills = 'skills',
  nuyen = 'nuyen',
  magic = 'magic',
}

export interface PriorityValues {
  metatypes: string[]
  adjustmentPoints: number
  attributePoints: number
  skillPoints: number
  nuyen: number
  magic: number // 0 = mundane, aspected is +1
}

export const priorityValues: Record<string, PriorityValues> = {
  'A': {
    metatypes: Object.values(Metatypes)
      .filter(metatype => metatype.priorityLevels.includes('A'))
      .map(metatype => metatype.id),
    adjustmentPoints: 13,
    attributePoints: 24,
    skillPoints: 32,
    magic: 4,
    nuyen: 450_000,
  },
  'B': {
    metatypes: Object.values(Metatypes)
      .filter(metatype => metatype.priorityLevels.includes('B'))
      .map(metatype => metatype.id),
    adjustmentPoints: 11,
    attributePoints: 16,
    skillPoints: 24,
    magic: 3,
    nuyen: 275_000,
  },
  'C': {
    metatypes: Object.values(Metatypes)
      .filter(metatype => metatype.priorityLevels.includes('C'))
      .map(metatype => metatype.id),
    adjustmentPoints: 9,
    attributePoints: 12,
    skillPoints: 20,
    magic: 2,
    nuyen: 150_000,
  },
  'D': {
    metatypes: Object.values(Metatypes)
      .filter(metatype => metatype.priorityLevels.includes('D'))
      .map(metatype => metatype.id),
    adjustmentPoints: 4,
    attributePoints: 8,
    skillPoints: 16,
    magic: 1,
    nuyen: 50_000,
  },
  'E': {
    metatypes: Object.values(Metatypes)
      .filter(metatype => metatype.priorityLevels.includes('E'))
      .map(metatype => metatype.id),
    adjustmentPoints: 1,
    attributePoints: 2,
    skillPoints: 10,
    magic: 0,
    nuyen: 8_000,
  },
}
