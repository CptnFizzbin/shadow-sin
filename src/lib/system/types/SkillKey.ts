import { AttributeKey } from "#/lib/system/types/attributeKey.ts";

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

export const Skills: Record<
  SkillKey,
  { attr: AttributeKey; group?: string; defaultable?: boolean }
> = {
  [SkillKey.aronauticsMechanic]: {
    attr: AttributeKey.logic,
    group: "mechanic",
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
    group: "mechanic",
    defaultable: false,
  },
  [SkillKey.automatics]: {
    attr: AttributeKey.agility,
    group: "firearms",
  },
  [SkillKey.banishing]: {
    attr: AttributeKey.magic,
    group: "conjuring",
    defaultable: false,
  },
  [SkillKey.binding]: {
    attr: AttributeKey.magic,
    group: "conjuring",
    defaultable: false,
  },
  [SkillKey.blades]: {
    attr: AttributeKey.agility,
    group: "close combat",
  },
  [SkillKey.chemistry]: {
    attr: AttributeKey.logic,
  },
  [SkillKey.climbing]: {
    attr: AttributeKey.strength,
    group: "athletics",
  },
  [SkillKey.clubs]: {
    attr: AttributeKey.agility,
    group: "close combat",
  },
  [SkillKey.compiling]: {
    attr: AttributeKey.resonance,
    group: "tasking",
    defaultable: false,
  },
  [SkillKey.computer]: {
    attr: AttributeKey.logic,
    group: "electronics",
  },
  [SkillKey.con]: {
    attr: AttributeKey.charisma,
    group: "influence",
  },
  [SkillKey.counterspelling]: {
    attr: AttributeKey.magic,
    group: "sorcery",
    defaultable: false,
  },
  [SkillKey.cybercombat]: {
    attr: AttributeKey.logic,
    group: "cracking",
  },
  [SkillKey.cybertechnology]: {
    attr: AttributeKey.logic,
    group: "biotech",
    defaultable: false,
  },
  [SkillKey.dataSearch]: {
    attr: AttributeKey.logic,
    group: "electronics",
  },
  [SkillKey.demolitions]: {
    attr: AttributeKey.logic,
  },
  [SkillKey.disguise]: {
    attr: AttributeKey.intuition,
    group: "stealth",
  },
  [SkillKey.diving]: {
    attr: AttributeKey.body,
  },
  [SkillKey.dodge]: {
    attr: AttributeKey.reaction,
  },
  [SkillKey.electronicWarfare]: {
    attr: AttributeKey.logic,
    group: "cracking",
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
    group: "influence",
  },
  [SkillKey.exoticMeleeWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.exoticRangedWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.firstAid]: {
    attr: AttributeKey.logic,
    group: "biotech",
  },
  [SkillKey.forgery]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.gunnery]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.gymnastics]: {
    attr: AttributeKey.agility,
    group: "athletics",
  },
  [SkillKey.hacking]: {
    attr: AttributeKey.logic,
    group: "cracking",
  },
  [SkillKey.hardware]: {
    attr: AttributeKey.logic,
    group: "electronics",
    defaultable: false,
  },
  [SkillKey.heavyWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.industrialMechanic]: {
    attr: AttributeKey.logic,
    group: "mechanic",
    defaultable: false,
  },
  [SkillKey.infiltration]: {
    attr: AttributeKey.agility,
    group: "stealth",
  },
  [SkillKey.instruction]: {
    attr: AttributeKey.charisma,
  },
  [SkillKey.intimidation]: {
    attr: AttributeKey.charisma,
  },
  [SkillKey.leadership]: {
    attr: AttributeKey.charisma,
    group: "influence",
  },
  [SkillKey.locksmith]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.longarms]: {
    attr: AttributeKey.agility,
    group: "firearms",
  },
  [SkillKey.medicine]: {
    attr: AttributeKey.logic,
    group: "biotech",
    defaultable: false,
  },
  [SkillKey.nauticalMechanic]: {
    attr: AttributeKey.logic,
    group: "mechanic",
    defaultable: false,
  },
  [SkillKey.navigation]: {
    attr: AttributeKey.intuition,
    group: "outdoors",
  },
  [SkillKey.negotiation]: {
    attr: AttributeKey.charisma,
    group: "influence",
  },
  [SkillKey.palming]: {
    attr: AttributeKey.agility,
    group: "stealth",
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
    group: "firearms",
  },
  [SkillKey.registering]: {
    attr: AttributeKey.resonance,
    group: "tasking",
    defaultable: false,
  },
  [SkillKey.ritualSpellcasting]: {
    attr: AttributeKey.magic,
    group: "sorcery",
    defaultable: false,
  },
  [SkillKey.running]: {
    attr: AttributeKey.strength,
    group: "athletics",
  },
  [SkillKey.shadowing]: {
    attr: AttributeKey.intuition,
    group: "stealth",
  },
  [SkillKey.software]: {
    attr: AttributeKey.logic,
    group: "electronics",
    defaultable: false,
  },
  [SkillKey.spellcasting]: {
    attr: AttributeKey.magic,
    group: "sorcery",
    defaultable: false,
  },
  [SkillKey.summoning]: {
    attr: AttributeKey.magic,
    group: "conjuring",
    defaultable: false,
  },
  [SkillKey.survival]: {
    attr: AttributeKey.willpower,
    group: "outdoors",
  },
  [SkillKey.swimming]: {
    attr: AttributeKey.strength,
    group: "athletics",
  },
  [SkillKey.thrownWeapons]: {
    attr: AttributeKey.agility,
  },
  [SkillKey.tracking]: {
    attr: AttributeKey.intuition,
    group: "outdoors",
  },
  [SkillKey.unarmedCombat]: {
    attr: AttributeKey.agility,
    group: "close combat",
  },
};
