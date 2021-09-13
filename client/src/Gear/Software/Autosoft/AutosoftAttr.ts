import { registerAttrNames } from '../../../System/Attribute'

export enum AutosoftAttr {
  rating = 'autosoft.rating',
  attr = 'autosoft.attr',
  skill = 'autosoft.skill',
  weapon = 'autosoft.weapon',
}

registerAttrNames({
  [AutosoftAttr.rating]: 'Rating',
  [AutosoftAttr.attr]: 'Attr',
  [AutosoftAttr.skill]: 'Skill',
  [AutosoftAttr.weapon]: 'Weapon',
})
