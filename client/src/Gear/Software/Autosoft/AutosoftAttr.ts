import { AttrNames } from '../../../System/Attribute'

export enum AutosoftAttr {
  rating = 'autosoft.rating',
  attr = 'autosoft.attr',
  skill = 'autosoft.skill',
  weapon = 'autosoft.weapon',
}

export const AutosoftAttrNames: AttrNames = {
  [AutosoftAttr.rating]: 'Rating',
  [AutosoftAttr.attr]: 'Attr',
  [AutosoftAttr.skill]: 'Skill',
  [AutosoftAttr.weapon]: 'Weapon',
}
