import { CharacterAttrNames } from '../Character/CharacterAttr'
import { GearAttributes } from '../Gear/GearAttributes'
import { GearData } from '../Gear/GearData'
import { collectGearEffects, isAttrAdj, isAttrOverride } from './Effect'

export type AttrType = string
export type AttrValue = number | string | null | undefined
export type AttrList<T = AttrValue> = Record<AttrType, T | undefined>
export type AttrNames = Record<AttrType, string>

const attributeNames: AttrNames = {
  ...CharacterAttrNames,
  ...GearAttributes,
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
    .filter(isAttrAdj)
    .filter(effect => effect.attr === attr)
    .reduce((sum, effect) => sum + effect.value, value)
}
