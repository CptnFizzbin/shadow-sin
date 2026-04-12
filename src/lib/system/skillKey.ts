import type { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/awakeningType.ts"
import type { SkillCategory } from "#/lib/system/skillCategory.ts"
import type { SkillGroupKey } from "#/lib/system/skillGroupKey.ts"

export enum SkillKey {
  aronauticsMechanic = "Aronautics Mechanic",
  arcana = "Arcana",
  archery = "Archery",
  armorer = "Armorer",
  artisan = "Artisan",
  assensing = "Assensing",
  astralCombat = "Astral Combat",
  autoMechanic = "Auto Mechanic",
  automatics = "Automatics",
  banishing = "Banishing",
  binding = "Binding",
  blades = "Blades",
  chemistry = "Chemistry",
  climbing = "Climbing",
  clubs = "Clubs",
  compiling = "Compiling",
  computer = "Computer",
  con = "Con",
  counterspelling = "Counterspelling",
  cybercombat = "Cybercombat",
  cybertechnology = "Cybertechnology",
  dataSearch = "Data Search",
  demolitions = "Demolitions",
  disguise = "Disguise",
  diving = "Diving",
  dodge = "Dodge",
  electronicWarfare = "Electronic Warfare",
  enchanting = "Enchanting",
  escapeArtist = "Escape Artist",
  etiquette = "Etiquette",
  exoticMeleeWeapons = "Exotic Melee Weapons",
  exoticRangedWeapons = "Exotic Ranged Weapons",
  firstAid = "First Aid",
  forgery = "Forgery",
  gunnery = "Gunnery",
  gymnastics = "Gymnastics",
  hacking = "Hacking",
  hardware = "Hardware",
  heavyWeapons = "Heavy Weapons",
  industrialMechanic = "Industrial Mechanic",
  infiltration = "Infiltration",
  instruction = "Instruction",
  intimidation = "Intimidation",
  leadership = "Leadership",
  locksmith = "Locksmith",
  longarms = "Longarms",
  medicine = "Medicine",
  nauticalMechanic = "Nautical Mechanic",
  navigation = "Navigation",
  negotiation = "Negotiation",
  palming = "Palming",
  parachuting = "Parachuting",
  perception = "Perception",
  pilotAerospace = "Pilot Aerospace",
  pilotAircraft = "Pilot Aircraft",
  pilotAnthroform = "Pilot Anthroform",
  pilotExoticVehicle = "Pilot Exotic Vehicle",
  pilotGroundCraft = "Pilot Ground Craft",
  pilotWatercraft = "Pilot Watercraft",
  pistols = "Pistols",
  registering = "Registering",
  ritualSpellcasting = "Ritual Spellcasting",
  running = "Running",
  shadowing = "Shadowing",
  software = "Software",
  spellcasting = "Spellcasting",
  summoning = "Summoning",
  survival = "Survival",
  swimming = "Swimming",
  thrownWeapons = "Thrown Weapons",
  tracking = "Tracking",
  unarmedCombat = "Unarmed Combat",
}

export interface SkillInfo {
  attr: AttributeKey
  category: SkillCategory
  group?: SkillGroupKey
  isWeaponSkill?: boolean
  defaultable?: boolean
  awakening?: AwakeningType[]

  /**
   * A list of available specializations for the skill.
   * Not the character's selected specialization
   */
  specializations?: (string | { custom: true, placeholder: string })[]
}
