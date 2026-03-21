import { SkillGroupKey } from "#/lib/system/types/SkillGroupKey.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

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
  group?: SkillGroupKey
  defaultable?: boolean
}

export const Skills: Record<SkillKey, SkillInfo> = {
  [SkillKey.aronauticsMechanic]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Mechanic,
    defaultable: false,
  },
  [SkillKey.arcana]: {
    attr: AttributeKey.logic,
    defaultable: false,
  },
  [SkillKey.archery]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.armorer]: {
    attr: AttributeKey.logic,
  },
  [SkillKey.artisan]: {
    attr: AttributeKey.intuition,
  },
  [SkillKey.assensing]: {
    attr: AttributeKey.intuition,
    defaultable: false,
  },
  [SkillKey.astralCombat]: {
    attr: AttributeKey.willpower,
    defaultable: false,
  },
  [SkillKey.autoMechanic]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Mechanic,
    defaultable: false,
  },
  [SkillKey.automatics]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.Firearms,
  },
  [SkillKey.banishing]: {
    attr: AttributeKey.magic,
    group: SkillGroupKey.Conjuring,
    defaultable: false,
  },
  [SkillKey.binding]: {
    attr: AttributeKey.magic,
    group: SkillGroupKey.Conjuring,
    defaultable: false,
  },
  [SkillKey.blades]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.CloseCombat,
  },
  [SkillKey.chemistry]: {
    attr: AttributeKey.logic,
  },
  [SkillKey.climbing]: {
    attr: AttributeKey.strength,
    group: SkillGroupKey.Athletics,
  },
  [SkillKey.clubs]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.CloseCombat,
  },
  [SkillKey.compiling]: {
    attr: AttributeKey.resonance,
    group: SkillGroupKey.Tasking,
    defaultable: false,
  },
  [SkillKey.computer]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Electronics,
  },
  [SkillKey.con]: {
    attr: AttributeKey.charisma,
    group: SkillGroupKey.Influence,
  },
  [SkillKey.counterspelling]: {
    attr: AttributeKey.magic,
    group: SkillGroupKey.Sorcery,
    defaultable: false,
  },
  [SkillKey.cybercombat]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Cracking,
  },
  [SkillKey.cybertechnology]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Biotech,
    defaultable: false,
  },
  [SkillKey.dataSearch]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Electronics,
  },
  [SkillKey.demolitions]: {
    attr: AttributeKey.logic,
  },
  [SkillKey.disguise]: {
    attr: AttributeKey.intuition,
    group: SkillGroupKey.Stealth,
  },
  [SkillKey.diving]: {
    attr: AttributeKey.body,
  },
  [SkillKey.dodge]: {
    attr: AttributeKey.reaction,
  },
  [SkillKey.electronicWarfare]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Cracking,
    defaultable: false,
  },
  [SkillKey.enchanting]: {
    attr: AttributeKey.magic,
  },
  [SkillKey.escapeArtist]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.etiquette]: {
    attr: AttributeKey.charisma,
    group: SkillGroupKey.Influence,
  },
  [SkillKey.exoticMeleeWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.exoticRangedWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.firstAid]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Biotech,
  },
  [SkillKey.forgery]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.gunnery]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.gymnastics]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.Athletics,
  },
  [SkillKey.hacking]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Cracking,
  },
  [SkillKey.hardware]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Electronics,
    defaultable: false,
  },
  [SkillKey.heavyWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.industrialMechanic]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Mechanic,
    defaultable: false,
  },
  [SkillKey.infiltration]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.Stealth,
  },
  [SkillKey.instruction]: {
    attr: AttributeKey.charisma,
  },
  [SkillKey.intimidation]: {
    attr: AttributeKey.charisma,
  },
  [SkillKey.leadership]: {
    attr: AttributeKey.charisma,
    group: SkillGroupKey.Influence,
  },
  [SkillKey.locksmith]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.longarms]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.Firearms,
  },
  [SkillKey.medicine]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Biotech,
    defaultable: false,
  },
  [SkillKey.nauticalMechanic]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Mechanic,
    defaultable: false,
  },
  [SkillKey.navigation]: {
    attr: AttributeKey.intuition,
    group: SkillGroupKey.Outdoors,
  },
  [SkillKey.negotiation]: {
    attr: AttributeKey.charisma,
    group: SkillGroupKey.Influence,
  },
  [SkillKey.palming]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.Stealth,
  },
  [SkillKey.parachuting]: {
    attr: AttributeKey.body,
  },
  [SkillKey.perception]: {
    attr: AttributeKey.intuition,
  },
  [SkillKey.pilotAerospace]: {
    attr: AttributeKey.reaction,
    defaultable: false,
  },
  [SkillKey.pilotAircraft]: {
    attr: AttributeKey.reaction,
    defaultable: false,
  },
  [SkillKey.pilotAnthroform]: {
    attr: AttributeKey.reaction,
    defaultable: false,
  },
  [SkillKey.pilotExoticVehicle]: {
    attr: AttributeKey.reaction,
    defaultable: false,
  },
  [SkillKey.pilotGroundCraft]: {
    attr: AttributeKey.reaction,
  },
  [SkillKey.pilotWatercraft]: {
    attr: AttributeKey.reaction,
  },
  [SkillKey.pistols]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.Firearms,
  },
  [SkillKey.registering]: {
    attr: AttributeKey.resonance,
    group: SkillGroupKey.Tasking,
    defaultable: false,
  },
  [SkillKey.ritualSpellcasting]: {
    attr: AttributeKey.magic,
    group: SkillGroupKey.Sorcery,
    defaultable: false,
  },
  [SkillKey.running]: {
    attr: AttributeKey.strength,
    group: SkillGroupKey.Athletics,
  },
  [SkillKey.shadowing]: {
    attr: AttributeKey.intuition,
    group: SkillGroupKey.Stealth,
  },
  [SkillKey.software]: {
    attr: AttributeKey.logic,
    group: SkillGroupKey.Electronics,
    defaultable: false,
  },
  [SkillKey.spellcasting]: {
    attr: AttributeKey.magic,
    group: SkillGroupKey.Sorcery,
    defaultable: false,
  },
  [SkillKey.summoning]: {
    attr: AttributeKey.magic,
    group: SkillGroupKey.Conjuring,
    defaultable: false,
  },
  [SkillKey.survival]: {
    attr: AttributeKey.willpower,
    group: SkillGroupKey.Outdoors,
  },
  [SkillKey.swimming]: {
    attr: AttributeKey.strength,
    group: SkillGroupKey.Athletics,
  },
  [SkillKey.thrownWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.tracking]: {
    attr: AttributeKey.intuition,
    group: SkillGroupKey.Outdoors,
  },
  [SkillKey.unarmedCombat]: {
    attr: AttributeKey.agility,
    group: SkillGroupKey.CloseCombat,
  },
}
