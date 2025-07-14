import { GearData, GearType } from '../../../Gear/GearData'
import { WeaponAttr } from '../../../Gear/Weapons/WeaponAttr'
import { WeaponModSlot } from '../../../Gear/Weapons/WeaponModData'
import { ActiveSkillIds, Specializations } from '../../../Skills'

export const weapons: GearData[] = [
  {
    id: '54f42560-89e0-4373-b105-4504aacb7df8',
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weapon,
    name: 'Browning Ultra Power',
    type: 'Heavy Pistol',
    avail: { rarity: 2, license: true },
    cost: 315,

    attributes: {
      [WeaponAttr.dv]: '3P',
      [WeaponAttr.modes]: 'SA',
      [WeaponAttr.attackRatings]: '10/9/6/-/-',
      [WeaponAttr.ammo]: '10(c)',
    },

    skill: ActiveSkillIds.CRB.firearms,
    specialtyName: Specializations.CRB.Firearms.HeavyPistols,
  },
  {
    id: 'a20d6a99-d6e3-4827-b1d4-b0fc250d0370',
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Laser Sight',
    type: 'Weapon Mod',
    slot: WeaponModSlot.top,
    removable: false,

    attachedTo: '54f42560-89e0-4373-b105-4504aacb7df8',

    description: `
      This device uses a laser beam to project a visible dot (normal, low-light, 
      or thermographic) on the target. This increases the weapon’s Attack Rating
      by 1, not cumulative with smartlink modifiers. The laser sight can be 
      mounted as either an underbarrel mount or top mount. Activating or 
      deactivating a laser sight is a Minor Action. 
      
      Note that in weapons with a laser sight included as standard equipment, 
      this bonus is already calculated into the Attack Rating
    `,

    wirelessBonus: {
      enabled: true,
      description: `
        The bonus to the Attack Rating increases to 2. You gain a bonus Minor 
        Action on a turn when you activate or deactivate the laser sight.
      `,
    },
  },
]
