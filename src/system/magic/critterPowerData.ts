export interface CritterPowerData {
  name: string
  description: string
}

const powers: CritterPowerData[] = [
  {
    name: "Accident",
    description:
      "The spirit causes misfortune around it. Opposed test: Force vs. Reaction + Intuition (threshold Force/2). On success, the target suffers a Glitch equal to net hits on their next action.",
  },
  {
    name: "Animal Control",
    description:
      "The spirit assumes control of an animal. Force + Charisma vs. Willpower + Charisma. Lasts Force turns or until the animal successfully resists again.",
  },
  {
    name: "Astral Form",
    description:
      "The spirit exists naturally in astral space and can perceive both the astral and physical planes simultaneously. It may shift between planes as a Free Action.",
  },
  {
    name: "Binding",
    description:
      "The spirit immobilizes a target in place. Force + Binding vs. Strength + Body. The target is immobilized for a number of turns equal to the net hits.",
  },
  {
    name: "Concealment",
    description:
      "Adds Force dice to Stealth tests for a chosen subject. Alternatively, imposes a −Force dice pool modifier on Perception tests made to notice the concealed subject.",
  },
  {
    name: "Confusion",
    description:
      "Force + Confusion vs. Willpower + Logic. Net hits become a dice pool penalty applied to the target's next action or task.",
  },
  {
    name: "Divining",
    description:
      "The spirit reads the past or senses the likely future of a specific person, place, or object. Roll Force as the dice pool; each hit reveals one piece of relevant information.",
  },
  {
    name: "Elemental Attack",
    description:
      "Ranged attack using Exotic Ranged Weapon skill. Deals Force DV of the spirit's element (Air, Fire, Earth, or Water) with AP equal to −⌊Force/2⌋. Range is Force × 10 meters.",
  },
  {
    name: "Energy Aura",
    description:
      "The spirit's body crackles with elemental energy. Any character striking it with a melee attack takes elemental DV equal to ⌈Force/2⌉ automatically. Also adds Force dice to the spirit's unarmed DV.",
  },
  {
    name: "Enhanced Senses",
    description:
      "The spirit possesses one or more heightened senses (chosen at summoning): Low-Light Vision, Thermographic Vision, Hearing Amplification, Smell, or Ultrasound.",
  },
  {
    name: "Engulf",
    description:
      "The spirit envelops a target in its elemental form. Force + Agility vs. Reaction + Body. While engulfed the target takes Force DV elemental damage each Combat Turn and cannot act freely.",
  },
  {
    name: "Fear",
    description:
      "Force + Charisma vs. Charisma + Willpower. Targets who fail flee from the spirit for net hits Combat Turns. A Composure test (threshold = net hits) ends the effect early.",
  },
  {
    name: "Flight",
    description:
      "The spirit flies freely. Its air speed equals its Movement rate (doubled for Air spirits). It maneuvers with no terrain penalties while airborne.",
  },
  {
    name: "Guard",
    description:
      "The spirit stands ready to absorb harm for a ward or protected individual. When the protected target takes damage, roll Force; each hit reduces the damage by 1 box (Physical or Stun).",
  },
  {
    name: "Influence",
    description:
      "Force + Charisma vs. Charisma + Willpower. The spirit plants a single post-hypnotic suggestion in the target's mind that lasts Force hours or until acted upon.",
  },
  {
    name: "Magical Guard",
    description:
      "The spirit extends a mantle of magical protection. Add its Force as bonus dice on any Drain resistance test made by the protected magician while this power is active.",
  },
  {
    name: "Materialization",
    description:
      "The spirit coalesces astral energy into a physical body. It may freely shift between astral and physical form as a Complex Action. Physical attacks affect it normally while materialized.",
  },
  {
    name: "Movement",
    description:
      "The spirit can multiply or divide a target's movement rate by up to Force. Unwilling targets resist with Reaction + Willpower (threshold = ⌈Force/2⌉).",
  },
  {
    name: "Natural Weapon",
    description:
      "The critter possesses natural weapons — claws, fangs, horns, or similar — with DV equal to ⌈Strength/2⌉ + 2 Physical, AP −1. These weapons count as magical for the purposes of barriers and immunity.",
  },
  {
    name: "Noxious Breath",
    description:
      "The spirit exhales a cloud of poisonous or caustic gas. Deals Force × 2 DV Stun reduced by 1 per meter from origin. Targets resist with Body + sealed Armor; standard armor provides no protection.",
  },
  {
    name: "Psychokinesis",
    description:
      "The spirit moves or manipulates physical objects at range without touching them. Effective Strength for lifting or throwing equals Force. Fine manipulation uses Force + Logic.",
  },
  {
    name: "Quake",
    description:
      "The earth spirit triggers a localized seismic event within Force × 2 meters. All targets in range resist Force DV Physical damage and must pass a Body + Reaction test (threshold 2) or be knocked prone.",
  },
  {
    name: "Sapience",
    description:
      "The spirit is fully sentient. It can speak, reason, form its own goals, and communicate in any language known to its summoner.",
  },
  {
    name: "Search",
    description:
      "The spirit seeks out a specific person, object, or place known to the summoner. Roll Force + Intuition; each hit reduces the search time by one hour (minimum one minute).",
  },
  {
    name: "Skill",
    description:
      "The spirit possesses one Active skill at a rating equal to its Force, chosen at summoning (e.g., Disguise, Stealth, Spellcasting). Each optional power slot spent grants one additional skill.",
  },
  {
    name: "Spell",
    description:
      "The Spirit of Man knows one specific spell (chosen at summoning) at a Force equal to the spirit's Force. Each optional power slot spent grants one additional spell.",
  },
  {
    name: "Venom",
    description:
      "The critter injects or projects venom (Toxin Rating = Force). Deals Force DV Stun resisted by Body, with an ongoing damage effect each turn until treated (first aid or antidote).",
  },
  {
    name: "Weather Control",
    description:
      "The spirit alters weather within Force × 100 meters. Dramatic changes (storms, heavy fog, extreme heat or cold) take Force hours to manifest and halve the effective radius.",
  },
]

const powerMap = new Map(powers.map((p) => [p.name.toLowerCase(), p]))

export function lookupCritterPower(name: string): CritterPowerData | undefined {
  const exact = powerMap.get(name.toLowerCase())
  if (exact) return exact

  // Strip parenthetical qualifier: "Elemental Attack (Air)" → "Elemental Attack"
  const baseName = name.replace(/\s*\(.*\)$/, "").trim().toLowerCase()
  return powerMap.get(baseName)
}
