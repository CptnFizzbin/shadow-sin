import { GearData } from '../GearData'
import { Ammo, FireMode } from './Firearms/Stats'
import { AttackRating, DamageValue } from './Stats'

export interface WeaponData extends GearData {
  dv: DamageValue
  attackRatings: AttackRating[]
  modes?: FireMode[]
  ammo?: Ammo
}
