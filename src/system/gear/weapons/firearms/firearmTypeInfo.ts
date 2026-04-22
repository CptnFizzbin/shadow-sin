import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import type { WeaponRangeInfo } from "#/system/gear/weapons/weaponRangeInfo.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export interface FirearmTypeInfo {
  weaponGroup: string
  skill: SkillKey
  ranges: WeaponRangeInfo
}

export const firearmTypes: Record<FirearmTypeKey, FirearmTypeInfo> = {
  [FirearmTypeKey.taser]: {
    weaponGroup: "pistols",
    skill: SkillKey.pistols,
    ranges: { short: 5, medium: 10, long: 15, extreme: 20 },
  },
  [FirearmTypeKey.holdout]: {
    weaponGroup: "pistols",
    skill: SkillKey.pistols,
    ranges: { short: 5, medium: 15, long: 30, extreme: 50 },
  },
  [FirearmTypeKey.lightPistol]: {
    weaponGroup: "pistols",
    skill: SkillKey.pistols,
    ranges: { short: 5, medium: 15, long: 30, extreme: 50 },
  },
  [FirearmTypeKey.heavyPistol]: {
    weaponGroup: "pistols",
    skill: SkillKey.pistols,
    ranges: { short: 5, medium: 20, long: 40, extreme: 60 },
  },
  [FirearmTypeKey.machinePistol]: {
    weaponGroup: "automatics",
    skill: SkillKey.automatics,
    ranges: { short: 5, medium: 15, long: 30, extreme: 50 },
  },
  [FirearmTypeKey.smg]: {
    weaponGroup: "automatics",
    skill: SkillKey.automatics,
    ranges: { short: 10, medium: 40, long: 80, extreme: 150 },
  },
  [FirearmTypeKey.assaultRifle]: {
    weaponGroup: "automatics",
    skill: SkillKey.automatics,
    ranges: { short: 50, medium: 150, long: 350, extreme: 550 },
  },
  [FirearmTypeKey.sportRifle]: {
    weaponGroup: "longarms",
    skill: SkillKey.longarms,
    ranges: { short: 100, medium: 250, long: 500, extreme: 750 },
  },
  [FirearmTypeKey.sniperRifle]: {
    weaponGroup: "longarms",
    skill: SkillKey.longarms,
    ranges: { short: 150, medium: 350, long: 800, extreme: 1500 },
  },
  [FirearmTypeKey.shotgun]: {
    weaponGroup: "longarms",
    skill: SkillKey.longarms,
    ranges: { short: 10, medium: 40, long: 80, extreme: 150 },
  },
  [FirearmTypeKey.shotgunFlechette]: {
    weaponGroup: "longarms",
    skill: SkillKey.longarms,
    ranges: { short: 10, medium: 25, long: 40, extreme: 60 },
  },
  [FirearmTypeKey.shotgunSlug]: {
    weaponGroup: "longarms",
    skill: SkillKey.longarms,
    ranges: { short: 10, medium: 40, long: 80, extreme: 150 },
  },
  [FirearmTypeKey.lmg]: {
    weaponGroup: "heavy weapons",
    skill: SkillKey.heavyWeapons,
    ranges: { short: 75, medium: 200, long: 400, extreme: 800 },
  },
  [FirearmTypeKey.mmg]: {
    weaponGroup: "heavy weapons",
    skill: SkillKey.heavyWeapons,
    ranges: { short: 80, medium: 250, long: 750, extreme: 1200 },
  },
  [FirearmTypeKey.hmg]: {
    weaponGroup: "heavy weapons",
    skill: SkillKey.heavyWeapons,
    ranges: { short: 80, medium: 250, long: 750, extreme: 1200 },
  },
  [FirearmTypeKey.assultCannon]: {
    weaponGroup: "heavy weapons",
    skill: SkillKey.heavyWeapons,
    ranges: { short: 100, medium: 300, long: 750, extreme: 1500 },
  },
  [FirearmTypeKey.grenadeLauncher]: {
    weaponGroup: "heavy weapons",
    skill: SkillKey.heavyWeapons,
    ranges: { minRange: 5, short: 50, medium: 100, long: 150, extreme: 500 },
  },
  [FirearmTypeKey.missleLauncher]: {
    weaponGroup: "heavy weapons",
    skill: SkillKey.heavyWeapons,
    ranges: { minRange: 20, short: 70, medium: 150, long: 450, extreme: 1500 },
  },
  [FirearmTypeKey.exoitic]: {
    weaponGroup: "exotic weapons",
    skill: SkillKey.exoticRangedWeapons,
    ranges: { short: 0, medium: 0, long: 0, extreme: 0 },
  },
}
