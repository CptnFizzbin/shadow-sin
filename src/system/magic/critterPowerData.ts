import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"
import type { SourceData } from "#/system/sourceData.ts"
import { SourceDataSchema } from "#/system/sourceData.ts"

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

const SpiritPoolFormulaSchema: z.ZodType<SpiritPoolFormula> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("force") }),
  z.object({ type: z.literal("force_plus"), attribute: z.nativeEnum(AttributeKey) }),
])

// Not yet wired into a form validator (see SpellDataSchema/AdeptPowerDataSchema for the pattern) — kept for parity with sibling item-data schemas
// fallow-ignore-next-line unused-export
export const CritterPowerDataSchema = z.object({
  name: z.string(),
  rollType: z.enum(["Opposed", "Standard", "Hidden"]).optional(),
  spiritPool: SpiritPoolFormulaSchema.optional(),
  targetPool: z.string().optional(),
  description: z.string(),
  source: SourceDataSchema.optional(),
}) satisfies z.ZodType<CritterPowerData>

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

const powers: Record<string, CritterPowerData> = {
  "astral gateway": {
    name: "Astral Gateway",
    description:
      "The spirit opens an astral rift (type: Mana, Complex Action, LOS Area, Sustained), forcing all physical objects within the area to be dual natured and allowing even mundanes to astrally project. The rift connects to any metaplane the spirit can visit itself.",
    source: { book: "SM", page: 98 },
  },
  "aura masking": {
    name: "Aura Masking",
    description:
      "Functions as both the Masking and Extended Masking initiate powers (type: Mana, Free Action, Self, Sustained). The spirit uses its Edge in place of initiate grade and can hide use of its own powers within the masked aura. Only runners who pierce the masking can detect those power uses.",
    source: { book: "SM", page: 98 },
  },
  "accident": {
    name: "Accident",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    targetPool: "Reaction + Intuition",
    description:
      "The critter causes a seemingly normal accident (Type: P, Complex, LOS, Instant). Opposed Test: Magic + Willpower vs. Reaction + Intuition. On a critter win, the target suffers an accident determined by the GM — trips, drops something, ejects a clip, etc. At 4+ net hits, treat it as a critical glitch. Against vehicles, the critter's Magic serves as a negative dice pool modifier to the driver's Crash Test.",
    source: { book: "SR20A", page: 293 },
  },
  "animal control": {
    name: "Animal Control",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Willpower + Charisma",
    description:
      "The critter directs the behavior of an animal or group of animals (Type: M, Complex, LOS, Sustained). Opposed Test: Magic + Charisma vs. Willpower + Charisma. Controlled behavior must fall within what is normal for the animal. Animals may not be commanded if they leave LOS, but continue to follow prior orders. The critter may control Charisma × 5 small animals (cats, rats) or Charisma large animals (wolves, bears) simultaneously. Cannot be used on critters with the Sapience power or a Magic attribute.",
    source: { book: "SR20A", page: 293 },
  },
  "armor": {
    name: "Armor",
    description:
      "The critter has an extremely tough hide that offers protection from attacks (Type: P, Auto, Self, Always). It has a natural Armor rating cumulative with any external armor worn. Critter armor is divided into Ballistic and Impact components, the same as runner armor.",
    source: { book: "SR20A", page: 293 },
  },
  "astral form": {
    name: "Astral Form",
    description:
      "The critter exists in the astral plane only (Type: M, Auto, Self, Always). It cannot be damaged by physical attacks or physical spells; only astral attacks or mana spells may hurt it. It cannot affect other creatures in the material world, only dual-natured creatures or astrally perceiving runners. Critters with this power may manifest on the physical plane in the same way as astrally projecting magicians can.",
    source: { book: "SR20A", page: 293 },
  },
  "banishing resistance": {
    name: "Banishing Resistance",
    description:
      "For purposes of resisting banishment, treat the spirit as if it has a number of services equal to its Edge that refresh every sunrise and sunset. These are cumulative with any services the spirit may actually owe a conjurer.",
    source: { book: "SM", page: 99 },
  },
  "binding": {
    name: "Binding",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    targetPool: "Strength + Body",
    description:
      "The critter makes its victim stick to any surface it is touching, or to the critter itself (Type: P, Complex, LOS, Instant). The victim may attempt to break free with a Complex Action, rolling Strength + Body against the critter's Magic + Willpower. If the victim prevails, it has escaped.",
    source: { book: "SR20A", page: 293 },
  },
  "compulsion": {
    name: "Compulsion",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Willpower + Charisma",
    description:
      "The critter compels a target to perform a specific action — generally only one type of action per critter (Type: M, Complex, LOS, Sustained). Opposed Test: Magic + Charisma vs. Willpower + Charisma. If the victim loses, it must immediately follow through with the compelled action. Compulsion cannot compel future actions.",
    source: { book: "SR20A", page: 293 },
  },
  "concealment": {
    name: "Concealment",
    description:
      "The critter mystically hides itself or others, or hides something people are looking for (Type: P, Simple, LOS, Sustained). Subtracts a number of dice equal to the critter's Magic from any Perception Tests to locate the concealed subject. Can be used on up to Magic targets simultaneously; concealed subjects can see each other if the critter allows. Also allows dual-natured critters to conceal themselves and others from astral detection.",
    source: { book: "SR20A", page: 293 },
  },
  "confusion": {
    name: "Confusion",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    targetPool: "Willpower",
    description:
      "The critter befuddles a victim so that the target is unable to make decisions, loses its sense of direction, and can't remember what it was doing (Type: M, Complex, LOS, Sustained). Opposed Test: Magic + Willpower vs. target's Willpower. Net hits scored by the critter serve as a dice pool penalty to any action the runner takes.",
    source: { book: "SR20A", page: 293 },
  },
  "corrosive spit": {
    name: "Corrosive Spit",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.agility },
    targetPool: "Reaction + Intuition",
    description:
      "The critter spits corrosive saliva at opponents (Type: P, Complex, LOS, Special). Treat as a standard ranged combat attack using the critter's Exotic Ranged Weapon + Agility. Range increments equal the critter's Body in meters. DV equals the critter's Magic; deals Acid damage (p. 163), resisted with half Impact armor (round up).",
    source: { book: "SR20A", page: 294 },
  },
  "desire reflection": {
    name: "Desire Reflection",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.intuition },
    targetPool: "Willpower + Intuition",
    description:
      "The spirit evokes a full-sensory illusion of the target's greatest desire (LOS, Sustained). Magic + Intuition vs. Willpower + Intuition. Net hits deceive the victim, who indulges as if the desire were real. If the victim is attacked or injured, they may re-resist; each hit reduces the spirit's net hits. If hits drop to 0 the victim breaks free.",
    source: { book: "SM", page: 99 },
  },
  "divining": {
    name: "Divining",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.intuition },
    description:
      "Functions like the Divining metamagic (Street Magic, p. 56). The spirit uses Magic + Intuition rather than Arcana to divine meaning from a reading.",
    source: { book: "SM", page: 99 },
  },
  "dual natured": {
    name: "Dual Natured",
    description:
      "The critter is active in the astral plane and can affect astral beings as well as physical ones (Type: P, Auto, Self, Always). Dual-natured creatures can perceive and interact with the astral plane. Unlike astral perception, dual nature is constant — the critter simultaneously senses both worlds without shifting back and forth. Dual-natured critters do not suffer the −2 dice pool modifier for interacting with the physical world while astrally perceiving.",
    source: { book: "SR20A", page: 294 },
  },
  "elemental attack": {
    name: "Elemental Attack",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.agility },
    targetPool: "Reaction + Intuition",
    description:
      "The critter releases a projected blast of damaging elemental energy — fire, intense cold, electricity, water, etc. (Type: P, Complex, LOS, Instant). Treat as a standard ranged combat attack using the critter's Exotic Ranged Weapon + Agility. DV equals the critter's Magic (Cold, Electricity, or Fire damage per p. 164); resisted with half Impact armor. The element is chosen at summoning and cannot be changed.",
    source: { book: "SR20A", page: 294 },
  },
  "endowment": {
    name: "Endowment",
    description:
      "The spirit grants a subject the use of one of its powers (Complex Action, Touch, Sustained). The spirit does not lose the power while the subject holds it. The spirit may endow up to twice its Magic in subjects simultaneously. No runner may hold more than one endowed power at a time.",
    source: { book: "SM", page: 99 },
  },
  "energy drain": {
    name: "Energy Drain",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    description:
      "The spirit drains one point of Karma, Force, Magic, or Essence from a victim (Complex Action, Touch or LOS, Permanent). Roll Willpower + Magic as an Extended Test (threshold = 10 − target's Essence or Force, interval 1 minute). If interrupted before the test completes, nothing is drained. On success the spirit adds the energy to its own (some convert it at 1:1, e.g. blood spirits turn Essence into Force). The victim suffers 1 box of damage per point drained — Stun (shadow spirits, FAB) or Physical (blood spirits, shedim). Drained points are permanently lost. If a victim's Magic reaches 0 they burn out; if Essence reaches 0 they die.",
    source: { book: "SM", page: 99 },
  },
  "energy aura": {
    name: "Energy Aura",
    description:
      "The critter continuously radiates an aura of damaging elemental energy — fire, cold, electricity, etc. (Type: P, Auto, Self, Always). Melee attacks made by the critter gain +4 to their Damage Value, treated as Cold, Electricity, or Fire damage (p. 164); resisted with half Impact armor. Any attacker who successfully hits the critter in melee also takes damage: make a Damage Resistance Test against DV equal to the critter's Magic (same elemental type), resisted with half Impact armor.",
    source: { book: "SR20A", page: 294 },
  },
  "enhanced senses": {
    name: "Enhanced Senses",
    description:
      "The critter possesses improved or augmented senses beyond the normal human range of awareness (Type: P, Auto, Self, Always). This includes low-light and thermographic vision, improved hearing and smell, heat-sensing organs, natural sonar, and so on. The specific senses are chosen at summoning.",
    source: { book: "SR20A", page: 294 },
  },
  "engulf": {
    name: "Engulf",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.body },
    targetPool: "Strength + Body",
    description:
      "The critter draws a victim into itself or the terrain it controls, smothering the victim (Type: P, Complex, Touch, Sustained). Treat as a melee attack; if it succeeds, the critter engulfs the victim. Each Action Phase the critter automatically inflicts DV equal to its Magic (net hits on the initial attack increase this DV). Victim resists with Body + half Impact armor unless otherwise noted. To escape, the victim makes an Opposed Test (Complex Action): Strength + Body vs. the critter's Magic + Body. On victim success, it has escaped and takes no more damage. Elemental variants — Fire Engulf: victim resists Fire damage. Water Engulf: victim resists Stun (drowning-like pressure); victim knocked unconscious continues taking Stun overflowing to Physical. Air Engulf: victim resists Stun as an inhalation-vector toxin (armor does not protect; protective gear per Toxin Protection table p. 254 may). Earth Engulf: victim resists Physical damage.",
    source: { book: "SR20A", page: 294 },
  },
  "essence drain": {
    name: "Essence Drain",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    description:
      "The critter drains Essence from a target, adding it to its own (Type: P, Complex, Touch, Permanent). The target must be willing or subdued (restrained, unconscious, mentally controlled, etc.). Extended Test: Charisma + Magic (threshold = 10 − target's Essence, interval 1 minute); if disturbed before the test ends, no Essence is drained. The critter may drain up to as many points of Essence as it currently possesses (min 1). Lost Essence affects the victim's Magic or Resonance rating. If a victim's Essence reaches 0, the runner dies. The transfer requires strong emotion (passion, terror, rage) focused personally on the critter. A victim being drained must make a Willpower (2) Test or become addicted (Mild Addiction quality, p. 93). The critter can siphon drained Essence into Physical or Mental attributes or Magic: every 2 Essence drained boosts one attribute by +1 (only one attribute at a time). The boost wears off after 12 hours, and half the Essence used to fuel the boost is lost.",
    source: { book: "SR20A", page: 294 },
  },
  "inhabitation": {
    name: "Inhabitation",
    rollType: "Opposed",
    description:
      "The spirit permanently merges with a prepared vessel over Force days. At the end, roll Force × 2 vs. the host's Willpower + Intuition (living) or vs. Object Resistance (inanimate). The conjurer may add their Binding skill to either pool. Result: 2+ net hits for spirit = True Form (host body consumed); neither side wins = Hybrid Form; 2+ net hits for vessel = Flesh Form (body unchanged). Once merged the spirit cannot be separated by Banishing or its own choice, and is only disrupted by Physical damage overflow killing the vessel.",
    source: { book: "SM", page: 100 },
  },
  "fear": {
    name: "Fear",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    targetPool: "Willpower",
    description:
      "The critter fills its victims with overwhelming terror (Type: M, Complex, LOS, Special). Opposed Test: Magic + Willpower vs. target's Willpower. The victim races in panic toward the nearest apparent safety and will not stop until out of sight and a safe distance away. The terror lasts 1 Combat Turn per net hit. After the effect ends, the target must succeed in a Willpower + Charisma Test (threshold = critter's net hits) to return or face the critter again.",
    source: { book: "SR20A", page: 295 },
  },
  "flight": {
    name: "Flight",
    description:
      "The spirit flies freely. Its air speed equals its Movement rate (doubled for Air spirits). It maneuvers with no terrain penalties while airborne.",
  },
  "guard": {
    name: "Guard",
    description:
      "The critter prevents normal environmental accidents and hazards — both natural ones and those induced by the Accident power (Type: P, Complex, LOS, Sustained). This includes preventing targets from succumbing to heatstroke, drowning, and similar dangers. Guard may also be used to prevent a glitch from occurring. The critter may guard a number of runners simultaneously equal to its Magic attribute.",
    source: { book: "SR20A", page: 295 },
  },
  "hardened armor": {
    name: "Hardened Armor",
    description:
      "The critter has armor even tougher than normal (Type: P, Auto, Self, Always). If the modified Damage Value of an attack does not exceed the Hardened Armor rating (after Armor Penetration), the attack bounces harmlessly off — no Damage Resistance Test is required. Otherwise, Hardened Armor provides both Ballistic and Impact armor equal to its rating.",
    source: { book: "SR20A", page: 295 },
  },
  "immunity": {
    name: "Immunity",
    description:
      "The critter has enhanced resistance to a specific type of attack or affliction (Type: P, Auto, Self, Always). The critter gains an effective Armor rating equal to twice its Magic against that damage type. This Immunity Armor is treated as hardened protection: if the DV does not exceed the Armor rating, the attack automatically does no damage. The Immunity armor is also added to the Damage Resistance Test as normal armor. Subtypes: Immunity to Age — the critter neither ages nor suffers the effects of aging. Immunity to Normal Weapons — applies to all non-magical weapons (weapon foci, spells, adept or critter powers are unaffected); if the critter has an Allergy weakness, Immunity does not apply against non-magical attacks using the allergen.",
    source: { book: "SR20A", page: 295 },
  },
  "infection": {
    name: "Infection",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Body + Willpower",
    description:
      "The critter infects any suitable creature it has drained to 0 Essence with the HMHVV virus it carries (Type: P, Auto, Touch, Permanent). Requires the Essence Drain power. Opposed Test: Magic + Charisma vs. Body + Willpower. If the critter wins, the victim is infected. The victim enters a state of near-death as physical, mental, and spiritual transformation begins. Within 24 hours the newly created critter revives at 1 Essence and must immediately drain Essence from another being. Player runners transformed through Infection automatically become NPCs upon their 'death' and are controlled by the GM thereafter.",
    source: { book: "SR20A", page: 295 },
  },
  "influence": {
    name: "Influence",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Willpower",
    description:
      "The critter insinuates suggestions into a target's mind, predisposing that person to some form of action, reaction, or emotion (Type: M, Complex, LOS, Instant). Opposed Test: Magic + Charisma vs. Willpower. If successful, the target carries out the suggestion. If later confronted with the wrongness of the suggestion, the subject may make a Willpower Test to overcome it (see Mental Manipulations, p. 210).",
    source: { book: "SR20A", page: 296 },
  },
  "magical guard": {
    name: "Magical Guard",
    description:
      "The spirit can use the Counterspelling skill to provide spell defense and dispel spells exactly as a magician can (Free Action, LOS, SR4A p. 185).",
    source: { book: "SM", page: 101 },
  },
  "materialization": {
    name: "Materialization",
    description:
      "The astral critter projects itself into the material world, allowing it to interact with physical beings (Type: P, Complex, Self, Sustained). When materialized, the critter may affect physical targets. Additionally, materialized critters gain Immunity to Normal Weapons.",
    source: { book: "SR20A", page: 296 },
  },
  "mind link": {
    name: "Mind Link",
    description:
      "The spirit opens a telepathic mental channel with a sapient creature within LOS (Simple Action, Sustained). The spirit may maintain a number of simultaneous links equal to its Magic. All creatures linked to the same spirit may communicate freely with each other as well as with the spirit.",
    source: { book: "SM", page: 101 },
  },
  "mystic armor": {
    name: "Mystic Armor",
    description:
      "The critter has natural protection from astral attacks (Type: M, Auto, Self, Always). Apply the critter's Mystic Armor rating against any astral attack that strikes it. Some critters may also have hardened Mystic Armor if they also possess the Hardened Armor power.",
    source: { book: "SR20A", page: 296 },
  },
  "mimicry": {
    name: "Mimicry",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    description:
      "The critter imitates a wide variety of sounds, including speech and the hunting calls of other creatures (Type: P, Simple, LOS, Sustained). The Perception Test threshold to determine that the sound is false equals the hits scored by the critter on a Charisma + Magic Test.",
    source: { book: "SR20A", page: 296 },
  },
  "mist form": {
    name: "Mist Form",
    description:
      "The critter magically transforms its body into mist (Type: P, Complex, Self, Sustained). In mist form it has a Movement rate of 5 meters per Combat Turn and can pass through any crack or crevice that is not airtight. Systems proof against gases, bacteria, or viral infiltration block it. While in mist form, the critter has Immunity to Normal Weapons but is vulnerable to strong winds, which may push/disrupt the mist and disorient the critter. Exposure to an allergen immediately forces it back to normal form. Shifting in or out of mist form requires a Complex Action.",
    source: { book: "SR20A", page: 296 },
  },
  "movement": {
    name: "Movement",
    description:
      "The critter may increase or decrease a subject's movement rate within the terrain it controls (Type: P, Complex, LOS, Sustained). Multiply or divide the target's movement rate by the critter's Magic. Limits: if the target's Body exceeds the critter's Magic, reduce the multiplier by half. If the target's Body exceeds Magic × 2, Movement has no effect.",
    source: { book: "SR20A", page: 296 },
  },
  "natural weapon": {
    name: "Natural Weapon",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.agility },
    targetPool: "Reaction + Intuition",
    description:
      "The critter possesses a natural form of weaponry capable of inflicting Physical damage — claws, sharp teeth, a stinger, etc. (Type: P, Complex, Touch, Instant). The power description specifies its DV and AP modifiers. Natural weapons may be melee or ranged; critters use Unarmed Combat for natural melee weapons and Exotic Ranged for natural ranged weapons. Critters without this power may still make unarmed attacks at DV (STR÷2)S. If the critter is dual-natured, Natural Weapon may be used with the normal Unarmed Combat skill to perform attacks against astral opponents.",
    source: { book: "SR20A", page: 296 },
  },
  "noxious breath": {
    name: "Noxious Breath",
    description:
      "The critter projects a nauseating stench to incapacitate victims (Type: P, Complex, special, Instant). Treat as an inhalation-vector toxin attack: Speed Immediate, Power equal to the critter's Magic, Effect Stun damage + nausea (see p. 254). Armor does not help resist this damage, but respiratory protection does (Toxin Protection table, p. 254). The blast extends in a cone out to Body meters and can catch up to two targets who are within one meter of each other.",
    source: { book: "SR20A", page: 296 },
  },
  "paralyzing howl": {
    name: "Paralyzing Howl",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.charisma },
    targetPool: "Willpower",
    description:
      "The critter emits a howl that affects everyone (friend or foe) able to hear it (Type: P, Complex, Special, Special). Opposed Test: Magic + Charisma vs. Willpower. Apply a dice pool modifier against the critter equal to the rating of any sound-dampening devices or hits scored by Hush/Silence spells. If the critter wins, each net hit reduces the target's Reaction by (Magic) minutes. If Reaction is reduced to 0, the runner is paralyzed and cannot move (except to breathe). After paralysis ends, Reaction returns at the rate of 1 point per minute.",
    source: { book: "SR20A", page: 296 },
  },
  "possession": {
    name: "Possession",
    rollType: "Opposed",
    description:
      "The spirit touches a vessel and attempts to possess it (Complex Action, Touch, Special). Roll Force × 2 vs. the vessel's Intuition + Willpower (living) or vs. Object Resistance (inanimate); apply +6 dice if the vessel was previously prepared. On failure the spirit is forced back to the astral plane. On success, vessel and spirit become a single dual-natured entity. A possessing spirit can be ejected by a normal Banishing Test; if ejected or banished, it cannot attempt that vessel again until the next sunrise or sunset.",
    source: { book: "SM", page: 101 },
  },
  "psychokinesis": {
    name: "Psychokinesis",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    description:
      "The critter generates psychokinetic energy with Strength and Agility equal to the hits scored on a Magic + Willpower Test (Type: P, Complex, LOS, Sustained). Functions similarly to the Magic Fingers spell (p. 221).",
    source: { book: "SR20A", page: 296 },
  },
  "regeneration": {
    name: "Regeneration",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.body },
    description:
      "The critter rapidly heals any damage (Type: P, Auto, Self, Always). At the end of each Combat Turn, make a Magic + Body Test; each hit regenerates 1 point of Physical or Stun damage. A critter in overflow is not considered dead until it has had a chance to make a Regeneration Test; if the overflow still exceeds Body after the test, the critter is dead. Cannot regenerate: damage to the brain or spinal cord (e.g., called shots to the head), or magical damage from weapon foci, combat spells, critter/adept powers, or other magic. If the critter has an Allergy, it cannot regenerate damage while the allergen is present.",
    source: { book: "SR20A", page: 296 },
  },
  "quake": {
    name: "Quake",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    description:
      "The spirit creates an earthquake affecting a radius of Force kilometers, shaking intermittently for Force minutes (Complex, Special, Instant). Roll Magic + Willpower; the number of hits determines the magnitude per the Quake Table (SM p. 101). Effects range from motion detectors failing (1 hit) to buildings collapsing and crevasses opening (8 hits).",
    source: { book: "SM", page: 102 },
  },
  "realistic form": {
    name: "Realistic Form",
    description:
      "The spirit can be mistaken for a normal physical creature or object when materialized (Auto, Self). A spirit appearing as a metahuman has a heartbeat and breathing rate; one appearing as an object mimics normal functionality. The spirit is not disguised on the astral plane. Spirits with this power may choose to appear in Realistic Form or their normal materialized form.",
    source: { book: "SM", page: 102 },
  },
  "sapience": {
    name: "Sapience",
    description:
      "The critter is self-aware with a choice-making consciousness (Type: P, Auto, Self, Always). Sapient critters are considered Untrained (p. 119) in any skills they do not possess and can default normally. They are also capable of learning new skills. While most sapient critters are mundane, some may Awaken and possess a Magic attribute; Awakened sapient critters follow the same rules for magic as normal runners.",
    source: { book: "SR20A", page: 297 },
  },
  "shadow cloak": {
    name: "Shadow Cloak",
    description:
      "The spirit envelops itself in magical darkness, appearing as a shadow (Free Action, Self, Sustained). Useless in full daylight; redundant in complete darkness. In Normal Light: −2 to Perception Tests to detect the spirit. In Partial Light: −4 to Perception Tests. In Glare conditions: +1 to Perception Tests against it.",
    source: { book: "SM", page: 102 },
  },
  "search": {
    name: "Search",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.intuition },
    description:
      "The critter may seek any person, place, or object (Type: P, Complex, Special, Special). Extended Test: Magic + Intuition (threshold 5, interval 10 minutes). Apply Search Modifiers: threshold +kilometers if target is more than 1 km away; threshold +5 if target is a nonliving object or place; −concealer's Magic if target is hidden by Concealment; −barrier's Force if hidden behind a mana barrier. The critter must have seen what it is searching for before; spirits may search for anything their summoner provides them with a mental image of. Critters with Astral Form may use Search in astral space without materializing.",
    source: { book: "SR20A", page: 297 },
  },
  "silence": {
    name: "Silence",
    description:
      "The spirit surrounds itself with a sphere of silence with radius equal to its Magic in meters (Complex, Special, Sustained). Sounds inside the area are muffled. Sound-based Perception Tests and the Damage Value of sound-based attacks are reduced by the spirit's Magic.",
    source: { book: "SM", page: 102 },
  },
  "skill": {
    name: "Skill",
    rollType: "Standard",
    spiritPool: { type: "force" },
    description:
      "The spirit possesses one Active skill at a rating equal to its Force, chosen at summoning (e.g., Disguise, Stealth, Spellcasting). Each optional power slot spent grants one additional skill.",
  },
  "innate spell": {
    name: "Innate Spell",
    rollType: "Opposed",
    spiritPool: { type: "force_plus", attribute: AttributeKey.magic },
    targetPool: "Willpower + Logic",
    description:
      "The critter has the instinctive ability to cast one spell using the Spellcasting skill (Type: A, Complex, See Spell, per spell). The critter must possess the Spellcasting skill. Innate Spells are treated the same as those cast by magicians; magicians may use Counterspelling against them normally. Drain is resisted with Intuition or Charisma (GM's discretion).",
    source: { book: "SR20A", page: 296 },
  },
  "storm": {
    name: "Storm",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.magic },
    description:
      "The spirit unleashes a massive elemental storm — icy rain, lightning, hurricane winds — across an area (Complex, Special, Physical damage). Radius = Magic × 100 meters. Roll Magic + Unarmed Combat; all creatures and objects in the area are subject to Suppressive Fire (SR4A p. 154). The Storm's base Damage Value equals the spirit's Force.",
    source: { book: "SM", page: 102 },
  },
  "venom": {
    name: "Venom",
    description:
      "The critter secretes a natural venom poisonous to runners and other critters (Type: P, Auto, Touch, Instant). Treat as a toxin (p. 254) with the following attributes: Vector injection, Speed 1 Combat Turn, Power 6, Effect Physical damage. Some critters may have toxins with different attributes, as noted in their individual descriptions.",
    source: { book: "SR20A", page: 297 },
  },
  "weather control": {
    name: "Weather Control",
    rollType: "Standard",
    spiritPool: { type: "force_plus", attribute: AttributeKey.willpower },
    description:
      "The critter manipulates certain weather conditions (Type: P, Complex, LOS, Sustained). The desired weather must be possible in the environment where the power is used (no blizzards in Death Valley or heat waves in Iceland). The weather condition builds over time, reaching a peak when the critter completes a Magic + Willpower Extended Test (threshold 10, interval 30 minutes). The creature only 'summons' the desired weather — it does not control it. For example, a creature that summons a thunderstorm cannot direct where lightning bolts may strike.",
    source: { book: "SR20A", page: 297 },
  },
}

export function lookupCritterPower(name: string): CritterPowerData | undefined {
  const exact = powers[name.toLowerCase()]
  if (exact) return exact

  // Strip parenthetical qualifier: "Elemental Attack (Air)" → "Elemental Attack"
  const baseName = name.replace(/\s*\(.*\)$/, "").trim().toLowerCase()
  return powers[baseName]
}

interface CritterWeaknessData {
  name: string
  description: string
  source?: SourceData
}

// Not yet wired into a form validator (see SpellDataSchema/AdeptPowerDataSchema for the pattern) — kept for parity with sibling item-data schemas
// fallow-ignore-next-line unused-export
export const CritterWeaknessDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  source: SourceDataSchema.optional(),
}) satisfies z.ZodType<CritterWeaknessData>

const weaknesses: Record<string, CritterWeaknessData> = {
  "allergy": {
    name: "Allergy",
    description:
      "The critter suffers discomfort or damage when touched by one or more allergen substances or conditions. This weakness is rated similarly to the Allergy negative quality (p. 94).",
    source: { book: "SR20A", page: 298 },
  },
  "dietary requirement": {
    name: "Dietary Requirement",
    description:
      "The critter must consume a certain type of unique substance at a regular interval to sustain its life. The substance must be unusual and exotic — examples include gold, metahuman flesh, orichalcum, or toxic waste. How much and how often varies from critter to critter. Without the specified requirement in its diet, the critter eventually sickens and dies.",
    source: { book: "SR20A", page: 298 },
  },
  "essence loss": {
    name: "Essence Loss",
    description:
      "The critter has no actual Essence of its own and must drain Essence from others to survive. Critters with Essence Loss lose 1 point of Essence every lunar cycle (1 month). As Essence decreases, Magic may also be affected (p. 68). If reduced to 0 Essence, the critter will die in (Body + Willpower) days if it does not replenish itself. A critter in this state is extremely dangerous — a starved predator that hunts for fresh Essence with mindless ferocity.",
    source: { book: "SR20A", page: 298 },
  },
  "reduced senses": {
    name: "Reduced Senses",
    description:
      "Any or all of the critter's five basic senses may be limited in effectiveness. Typically reduced senses function at half-normal range or effectiveness, but a critter can be handicapped further, even to the point of complete absence of that sense.",
    source: { book: "SR20A", page: 298 },
  },
  "uneducated": {
    name: "Uneducated",
    description:
      "While sapient critters are capable of interacting with society, some are not sophisticated enough to adapt to a high-tech society. Some, such as the naga and the merrow, still live under very primitive standards and have not evolved to the level of metahumanity. This weakness behaves in the same manner as the Uneducated negative quality (p. 96).",
    source: { book: "SR20A", page: 298 },
  },
}

// No consuming UI yet (mirrors lookupCritterPower/critterPowerChip.tsx, which is wired up) — kept for a future critter-weakness display
// fallow-ignore-next-line unused-export
export function lookupCritterWeakness(name: string): CritterWeaknessData | undefined {
  const exact = weaknesses[name.toLowerCase()]
  if (exact) return exact
  const baseName = name.replace(/\s*\(.*\)$/, "").trim().toLowerCase()
  return weaknesses[baseName]
}
