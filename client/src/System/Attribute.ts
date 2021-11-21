import { GearData } from '../Gear/GearData'
import { collectGearEffects, isAttrBonus, isAttrOverride } from './Effect'

export type AttrType = string
export type AttrValue = number | string | null | undefined
export type AttrList<T = AttrValue> = Record<AttrType, T | undefined>
export type AttrNames = Record<AttrType, string>

let attributeNames: AttrNames = {}

export const registerAttrNames = (names: AttrNames): void => {
  attributeNames = { ...attributeNames, ...names }
}

export const formatAttr = (type: string): string => {
  return attributeNames[type] || type
}

export const calculateAttributes = (attrs: AttrList, gear: GearData[]): AttrList => {
  const adjustedAttrs: AttrList = {}

  Object.entries(attrs).forEach(([attr, value]) => {
    if (typeof value === 'number') value = calculateAttribute(attr, value, gear)
    adjustedAttrs[attr] = value
  })

  return adjustedAttrs
}

export const calculateAttribute = (attr: string, value: number, gear: GearData[]): number => {
  const effects = collectGearEffects(gear)

  const overrides = effects
    .filter(isAttrOverride)
    .filter(effect => effect.attr === attr)
    .map(effect => effect.value)

  if (overrides.length >= 1) return Math.max(...overrides)

  return effects
    .filter(isAttrBonus)
    .filter(effect => effect.attr === attr)
    .reduce((sum, effect) => sum + effect.bonus, value)
}
