import { RecordId } from '../Api/Model'
import { AttrList } from '../System/Attribute'

export type Source = { book: string; page: number } | 'Homebrew'
export type Cost = number
export type Availability = {
  rarity: number
  illegal?: boolean
  license?: boolean
}

export enum GearType {
  other = 'other',
  weapon = 'weapon',
  vehicle = 'vehicle',
  vehicleMod = 'vehicleMod',
  autosoft = 'autosoft',
  rcc = 'rcc',
  augment = 'augment',
  controlRig = 'controlRig',
  weaponMod = 'weaponMod',
}

export interface GearData {
  dataVersion?: number
  id: RecordId
  source?: Source
  gearType: GearType
  name: string
  description?: string
  type: string
  avail?: Availability
  cost?: Cost
  capacity?: number

  attributes?: AttrList
  attachedTo?: RecordId

  wirelessBonus?: {
    enabled: boolean
    description: string
    effect?: unknown
  }

  [key: string]: unknown
}

export const formatAvail = (avail: Availability): string => {
  return `${avail.rarity}${avail.illegal ? '(i)' : ''}${avail.license ? '(L)' : ''}`
}

const costFormatter = new Intl.NumberFormat('en')
export const formatCost = (cost: number): string => {
  return costFormatter.format(cost) + '¥'
}

export const formatSource = (source: Source): string => {
  if (typeof source === 'string') return source
  return `${source.book} p.${source.page}`
}
