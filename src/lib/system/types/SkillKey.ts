import type { AttributeKey } from "#/lib/system/types/attributeKey.ts";

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
		attr: "logic",
		group: "mechanic",
		defaultable: false,
	},
	[SkillKey.arcana]: {
		attr: "logic",
		defaultable: false,
	},
	[SkillKey.archery]: {
		attr: "agility",
	},
	[SkillKey.armorer]: {
		attr: "logic",
	},
	[SkillKey.artisan]: {
		attr: "intuition",
	},
	[SkillKey.assensing]: {
		attr: "intuition",
		defaultable: false,
	},
	[SkillKey.astralCombat]: {
		attr: "willpower",
		defaultable: false,
	},
	[SkillKey.autoMechanic]: {
		attr: "logic",
		group: "mechanic",
		defaultable: false,
	},
	[SkillKey.automatics]: {
		attr: "agility",
		group: "firearms",
	},
	[SkillKey.banishing]: {
		attr: "magic",
		group: "conjuring",
		defaultable: false,
	},
	[SkillKey.binding]: {
		attr: "magic",
		group: "conjuring",
		defaultable: false,
	},
	[SkillKey.blades]: {
		attr: "agility",
		group: "close combat",
	},
	[SkillKey.chemistry]: {
		attr: "logic",
	},
	[SkillKey.climbing]: {
		attr: "strength",
		group: "athletics",
	},
	[SkillKey.clubs]: {
		attr: "agility",
		group: "close combat",
	},
	[SkillKey.compiling]: {
		attr: "resonance",
		group: "tasking",
		defaultable: false,
	},
	[SkillKey.computer]: {
		attr: "logic",
		group: "electronics",
	},
	[SkillKey.con]: {
		attr: "charisma",
		group: "influence",
	},
	[SkillKey.counterspelling]: {
		attr: "magic",
		group: "sorcery",
		defaultable: false,
	},
	[SkillKey.cybercombat]: {
		attr: "logic",
		group: "cracking",
	},
	[SkillKey.cybertechnology]: {
		attr: "logic",
		group: "biotech",
		defaultable: false,
	},
	[SkillKey.dataSearch]: {
		attr: "logic",
		group: "electronics",
	},
	[SkillKey.demolitions]: {
		attr: "logic",
	},
	[SkillKey.disguise]: {
		attr: "intuition",
		group: "stealth",
	},
	[SkillKey.diving]: {
		attr: "body",
	},
	[SkillKey.dodge]: {
		attr: "reaction",
	},
	[SkillKey.electronicWarfare]: {
		attr: "logic",
		group: "cracking",
		defaultable: false,
	},
	[SkillKey.enchanting]: {
		attr: "magic",
	},
	[SkillKey.escapeArtist]: {
		attr: "agility",
	},
	[SkillKey.etiquette]: {
		attr: "charisma",
		group: "influence",
	},
	[SkillKey.exoticMeleeWeapons]: {
		attr: "agility",
	},
	[SkillKey.exoticRangedWeapons]: {
		attr: "agility",
	},
	[SkillKey.firstAid]: {
		attr: "logic",
		group: "biotech",
	},
	[SkillKey.forgery]: {
		attr: "agility",
	},
	[SkillKey.gunnery]: {
		attr: "agility",
	},
	[SkillKey.gymnastics]: {
		attr: "agility",
		group: "athletics",
	},
	[SkillKey.hacking]: {
		attr: "logic",
		group: "cracking",
	},
	[SkillKey.hardware]: {
		attr: "logic",
		group: "electronics",
		defaultable: false,
	},
	[SkillKey.heavyWeapons]: {
		attr: "agility",
	},
	[SkillKey.industrialMechanic]: {
		attr: "logic",
		group: "mechanic",
		defaultable: false,
	},
	[SkillKey.infiltration]: {
		attr: "agility",
		group: "stealth",
	},
	[SkillKey.instruction]: {
		attr: "charisma",
	},
	[SkillKey.intimidation]: {
		attr: "charisma",
	},
	[SkillKey.leadership]: {
		attr: "charisma",
		group: "influence",
	},
	[SkillKey.locksmith]: {
		attr: "agility",
	},
	[SkillKey.longarms]: {
		attr: "agility",
		group: "firearms",
	},
	[SkillKey.medicine]: {
		attr: "logic",
		group: "biotech",
		defaultable: false,
	},
	[SkillKey.nauticalMechanic]: {
		attr: "logic",
		group: "mechanic",
		defaultable: false,
	},
	[SkillKey.navigation]: {
		attr: "intuition",
		group: "outdoors",
	},
	[SkillKey.negotiation]: {
		attr: "charisma",
		group: "influence",
	},
	[SkillKey.palming]: {
		attr: "agility",
		group: "stealth",
	},
	[SkillKey.parachuting]: {
		attr: "body",
	},
	[SkillKey.perception]: {
		attr: "intuition",
	},
	[SkillKey.pilotAerospace]: {
		attr: "reaction",
		defaultable: false,
	},
	[SkillKey.pilotAircraft]: {
		attr: "reaction",
		defaultable: false,
	},
	[SkillKey.pilotAnthroform]: {
		attr: "reaction",
		defaultable: false,
	},
	[SkillKey.pilotExoticVehicle]: {
		attr: "reaction",
		defaultable: false,
	},
	[SkillKey.pilotGroundCraft]: {
		attr: "reaction",
	},
	[SkillKey.pilotWatercraft]: {
		attr: "reaction",
	},
	[SkillKey.pistols]: {
		attr: "agility",
		group: "firearms",
	},
	[SkillKey.registering]: {
		attr: "resonance",
		group: "tasking",
		defaultable: false,
	},
	[SkillKey.ritualSpellcasting]: {
		attr: "magic",
		group: "sorcery",
		defaultable: false,
	},
	[SkillKey.running]: {
		attr: "strength",
		group: "athletics",
	},
	[SkillKey.shadowing]: {
		attr: "intuition",
		group: "stealth",
	},
	[SkillKey.software]: {
		attr: "logic",
		group: "electronics",
		defaultable: false,
	},
	[SkillKey.spellcasting]: {
		attr: "magic",
		group: "sorcery",
		defaultable: false,
	},
	[SkillKey.summoning]: {
		attr: "magic",
		group: "conjuring",
		defaultable: false,
	},
	[SkillKey.survival]: {
		attr: "willpower",
		group: "outdoors",
	},
	[SkillKey.swimming]: {
		attr: "strength",
		group: "athletics",
	},
	[SkillKey.thrownWeapons]: {
		attr: "agility",
	},
	[SkillKey.tracking]: {
		attr: "intuition",
		group: "outdoors",
	},
	[SkillKey.unarmedCombat]: {
		attr: "agility",
		group: "close combat",
	},
};
