import { AttributeKey } from "#/system/attributeKey.ts"
import type { SourceData } from "#/system/sourceData.ts"

export type RollType = "Opposed" | "Standard" | "Hidden"

export type SpiritPoolFormula =
  | { type: "force" }
  | { type: "force_plus", attribute: AttributeKey }

export interface CritterPowerData {
  name: string
  rollType?: RollType
  /** Formula used to compute how many dice the spirit rolls. Omitted for passive powers. */
  spiritPool?: SpiritPoolFormula
  /** Label for what the target rolls (Opposed only). */
  targetPool?: string
  description: string
  source?: SourceData
}

export function computeSpiritPowerPool(
  formula: SpiritPoolFormula,
  force: number,
  attrs: Record<AttributeKey, number>,
): number {
  switch (formula.type) {
    case "force": return force
    case "force_plus": return force + attrs[formula.attribute]
    default: return force
  }
}

export function formatSpiritPoolLabel(formula: SpiritPoolFormula): string {
  switch (formula.type) {
    case "force": return "Force"
    case "force_plus": {
      const label = formula.attribute.charAt(0).toUpperCase() + formula.attribute.slice(1)
      return `Force + ${label}`
    }
    default: return "Force"
  }
}

const powers: CritterPowerData[] = [
  {
    name: "Astral Gateway",
    description:
      "The spirit opens an astral rift (type: Mana, Complex Action, LOS Area, Sustained), forcing all physical objects within the area to be dual natured and allowing even mundanes to astrally project. The rift connects to any metaplane the spirit can visit itself.",
    source: { book: "SM", page: 98 },
  },
  {
    name: "Aura Masking",
    description:
      "Functions as both the Masking and Extended Masking initiate powers (type: Mana, Free Action, Self, Sustained). The spirit uses its Edge in place of initiate grade and can hide use of its own powers within the masked aura. Only characters who pierce the masking can detect those power uses.",
    source: { book: "SM", page: 98 },
  },
  {
    name: "Accident",
    rollType: "Hidden",
    spiritPool: { type: "force" },
    targetPool: "Reaction + Intuition",
    description:
      "The spirit causes misfortune around it. Opposed test: Force vs. Reaction + Intuition (threshold Force/2). On success, the target suffers a Glitch equal to net hits on their next action.",
  },
  {
    name: "Animal Control",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Willpower + Charisma",
    description:
      "The spirit assumes control of an animal. Force + Charisma vs. Willpower + Charisma. Lasts Force turns or until the animal successfully resists again.",
  },
  {
    name: "Astral Form",
    description:
      "The spirit exists naturally in astral space and can perceive both the astral and physical planes simultaneously. It may shift between planes as a Free Action.",
  },
  {
    name: "Banishing Resistance",
    description:
      "For purposes of resisting banishment, treat the spirit as if it has a number of services equal to its Edge that refresh every sunrise and sunset. These are cumulative with any services the spirit may actually owe a conjurer.",
    source: { book: "SM", page: 99 },
  },
  {
    name: "Binding",
    rollType: "Opposed",
    spiritPool: { type: "force" },
    targetPool: "Strength + Body",
    description:
      "The spirit immobilizes a target in place. Force vs. Strength + Body. The target is immobilized for a number of turns equal to the net hits.",
  },
  {
    name: "Concealment",
    description:
      "Adds Force dice to Stealth tests for a chosen subject. Alternatively, imposes a −Force dice pool modifier on Perception tests made to notice the concealed subject.",
  },
  {
    name: "Confusion",
    rollType: "Opposed",
    spiritPool: { type: "force" },
    targetPool: "Willpower + Logic",
    description:
      "Force vs. Willpower + Logic. Net hits become a dice pool penalty applied to the target's next action or task.",
  },
  {
    name: "Desire Reflection",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.intuition },
    targetPool: "Willpower + Intuition",
    description:
      "The spirit evokes a full-sensory illusion of the target's greatest desire (LOS, Sustained). Magic + Intuition vs. Willpower + Intuition. Net hits deceive the victim, who indulges as if the desire were real. If the victim is attacked or injured, they may re-resist; each hit reduces the spirit's net hits. If hits drop to 0 the victim breaks free.",
    source: { book: "SM", page: 99 },
  },
  {
    name: "Divining",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.intuition },
    description:
      "Functions like the Divining metamagic (Street Magic, p. 56). The spirit uses Magic + Intuition rather than Arcana to divine meaning from a reading.",
    source: { book: "SM", page: 99 },
  },
  {
    name: "Elemental Attack",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.agility },
    targetPool: "Reaction + Intuition",
    description:
      "Ranged attack using Exotic Ranged Weapon skill. Deals Force DV of the spirit's element (Air, Fire, Earth, or Water) with AP equal to −⌊Force/2⌋. Range is Force × 10 meters.",
  },
  {
    name: "Endowment",
    description:
      "The spirit grants a subject the use of one of its powers (Complex Action, Touch, Sustained). The spirit does not lose the power while the subject holds it. The spirit may endow up to twice its Magic in subjects simultaneously. No character may hold more than one endowed power at a time.",
    source: { book: "SM", page: 99 },
  },
  {
    name: "Energy Drain",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    description:
      "The spirit drains one point of Karma, Force, Magic, or Essence from a victim (Complex Action, Touch or LOS, Permanent). Roll Willpower + Magic as an Extended Test (threshold = 10 − target's Essence or Force, interval 1 minute). If interrupted before the test completes, nothing is drained. On success the spirit adds the energy to its own (some convert it at 1:1, e.g. blood spirits turn Essence into Force). The victim suffers 1 box of damage per point drained — Stun (shadow spirits, FAB) or Physical (blood spirits, shedim). Drained points are permanently lost. If a victim's Magic reaches 0 they burn out; if Essence reaches 0 they die.",
    source: { book: "SM", page: 99 },
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
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.agility },
    targetPool: "Reaction + Body",
    description:
      "Force + Agility vs. Reaction + Body (Complex, Touch, Sustained). Engulfing material appears next to the spirit — the spirit may leave the victim's vicinity while the power continues. Damage type varies by spirit: Air/Earth/Fire/Water inflict elemental Physical damage (SR4A p. 294); Guidance inflicts Stun damage resisted by Willpower with armor ignored; Plant inflicts Stun damage from vines and thorns.",
    source: { book: "SM", page: 100 },
  },
  {
    name: "Inhabitation",
    rollType: "Opposed",
    description:
      "The spirit permanently merges with a prepared vessel over Force days. At the end, roll Force × 2 vs. the host's Willpower + Intuition (living) or vs. Object Resistance (inanimate). The conjurer may add their Binding skill to either pool. Result: 2+ net hits for spirit = True Form (host body consumed); neither side wins = Hybrid Form; 2+ net hits for vessel = Flesh Form (body unchanged). Once merged the spirit cannot be separated by Banishing or its own choice, and is only disrupted by Physical damage overflow killing the vessel.",
    source: { book: "SM", page: 100 },
  },
  {
    name: "Fear",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Charisma + Willpower",
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
    rollType: "Standard",
    spiritPool: { type: "force" },
    description:
      "The spirit stands ready to absorb harm for a ward or protected individual. When the protected target takes damage, roll Force; each hit reduces the damage by 1 box (Physical or Stun).",
  },
  {
    name: "Influence",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Charisma + Willpower",
    description:
      "Force + Charisma vs. Charisma + Willpower. The spirit plants a single post-hypnotic suggestion in the target's mind that lasts Force hours or until acted upon.",
  },
  {
    name: "Magical Guard",
    description:
      "The spirit can use the Counterspelling skill to provide spell defense and dispel spells exactly as a magician can (Free Action, LOS, SR4A p. 185).",
    source: { book: "SM", page: 101 },
  },
  {
    name: "Materialization",
    description:
      "The spirit coalesces astral energy into a physical body. It may freely shift between astral and physical form as a Complex Action. Physical attacks affect it normally while materialized.",
  },
  {
    name: "Mind Link",
    description:
      "The spirit opens a telepathic mental channel with a sapient creature within LOS (Simple Action, Sustained). The spirit may maintain a number of simultaneous links equal to its Magic. All creatures linked to the same spirit may communicate freely with each other as well as with the spirit.",
    source: { book: "SM", page: 101 },
  },
  {
    name: "Movement",
    rollType: "Opposed",
    spiritPool: { type: "force" },
    targetPool: "Reaction + Willpower",
    description:
      "The spirit can multiply or divide a target's movement rate by up to Force. Unwilling targets resist with Reaction + Willpower (threshold = ⌈Force/2⌉).",
  },
  {
    name: "Natural Weapon",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.agility },
    targetPool: "Reaction + Intuition",
    description:
      "The critter possesses natural weapons — claws, fangs, horns, or similar — with DV equal to ⌈Strength/2⌉ + 2 Physical, AP −1. These weapons count as magical for the purposes of barriers and immunity.",
  },
  {
    name: "Noxious Breath",
    rollType: "Standard",
    spiritPool: { type: "force" },
    description:
      "The spirit exhales a cloud of poisonous or caustic gas. Deals Force × 2 DV Stun reduced by 1 per meter from origin. Targets resist with Body + sealed Armor; standard armor provides no protection.",
  },
  {
    name: "Possession",
    rollType: "Opposed",
    description:
      "The spirit touches a vessel and attempts to possess it (Complex Action, Touch, Special). Roll Force × 2 vs. the vessel's Intuition + Willpower (living) or vs. Object Resistance (inanimate); apply +6 dice if the vessel was previously prepared. On failure the spirit is forced back to the astral plane. On success, vessel and spirit become a single dual-natured entity. A possessing spirit can be ejected by a normal Banishing Test; if ejected or banished, it cannot attempt that vessel again until the next sunrise or sunset.",
    source: { book: "SM", page: 101 },
  },
  {
    name: "Psychokinesis",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.logic },
    description:
      "The spirit moves or manipulates physical objects at range without touching them. Effective Strength for lifting or throwing equals Force. Fine manipulation uses Force + Logic.",
  },
  {
    name: "Quake",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    description:
      "The spirit creates an earthquake affecting a radius of Force kilometers, shaking intermittently for Force minutes (Complex, Special, Instant). Roll Magic + Willpower; the number of hits determines the magnitude per the Quake Table (SM p. 101). Effects range from motion detectors failing (1 hit) to buildings collapsing and crevasses opening (8 hits).",
    source: { book: "SM", page: 102 },
  },
  {
    name: "Realistic Form",
    description:
      "The spirit can be mistaken for a normal physical creature or object when materialized (Auto, Self). A spirit appearing as a metahuman has a heartbeat and breathing rate; one appearing as an object mimics normal functionality. The spirit is not disguised on the astral plane. Spirits with this power may choose to appear in Realistic Form or their normal materialized form.",
    source: { book: "SM", page: 102 },
  },
  {
    name: "Sapience",
    description:
      "The spirit is fully sentient. It can speak, reason, form its own goals, and communicate in any language known to its summoner.",
  },
  {
    name: "Shadow Cloak",
    description:
      "The spirit envelops itself in magical darkness, appearing as a shadow (Free Action, Self, Sustained). Useless in full daylight; redundant in complete darkness. In Normal Light: −2 to Perception Tests to detect the spirit. In Partial Light: −4 to Perception Tests. In Glare conditions: +1 to Perception Tests against it.",
    source: { book: "SM", page: 102 },
  },
  {
    name: "Search",
    rollType: "Hidden",
    spiritPool: { type: "force_plus", attribute: AttributeKey.intuition },
    description:
      "The spirit seeks out a specific person, object, or place known to the summoner. Roll Force + Intuition; each hit reduces the search time by one hour (minimum one minute).",
  },
  {
    name: "Silence",
    description:
      "The spirit surrounds itself with a sphere of silence with radius equal to its Magic in meters (Complex, Special, Sustained). Sounds inside the area are muffled. Sound-based Perception Tests and the Damage Value of sound-based attacks are reduced by the spirit's Magic.",
    source: { book: "SM", page: 102 },
  },
  {
    name: "Skill",
    rollType: "Standard",
    spiritPool: { type: "force" },
    description:
      "The spirit possesses one Active skill at a rating equal to its Force, chosen at summoning (e.g., Disguise, Stealth, Spellcasting). Each optional power slot spent grants one additional skill.",
  },
  {
    name: "Innate Spell",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.magic },
    targetPool: "Willpower + Logic",
    description:
      "The spirit knows one spell chosen by the summoner at summoning. The spell is cast at Force equal to the spirit's Magic. Force is limited to the spirit's Magic rating.",
  },
  {
    name: "Storm",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.magic },
    description:
      "The spirit unleashes a massive elemental storm — icy rain, lightning, hurricane winds — across an area (Complex, Special, Physical damage). Radius = Magic × 100 meters. Roll Magic + Unarmed Combat; all creatures and objects in the area are subject to Suppressive Fire (SR4A p. 154). The Storm's base Damage Value equals the spirit's Force.",
    source: { book: "SM", page: 102 },
  },
  {
    name: "Venom",
    rollType: "Standard",
    spiritPool: { type: "force" },
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
