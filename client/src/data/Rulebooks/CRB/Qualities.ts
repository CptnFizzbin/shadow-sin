import { Quality, QualityId } from '../../../Qualities/Quality'
import { DamageType } from '../../../System/Damage/DamageType'
import { EffectType } from '../../../System/Effect'

export enum QualityIds {
  // Positive Qualities
  ambidextrous = 'quality.CRB.ambidextrous',
  analyticalMind = 'quality.CRB.analyticalMind',
  aptitude = 'quality.CRB.aptitude',
  astralChameleon = 'quality.CRB.astralChameleon',
  blandness = 'quality.CRB.blandness',
  builtTough = 'quality.CRB.builtTough',
  catlike = 'quality.CRB.catlike',
  dermalDeposits = 'quality.CRB.dermalDeposits',
  doubleJointed = 'quality.CRB.doubleJointed',
  elementalResistance = 'quality.CRB.elementalResistance',
  exceptional = 'quality.CRB.exceptional',
  firstImpression = 'quality.CRB.firstImpression',
  focusedConcentration = 'quality.CRB.focusedConcentration',
  gearhead = 'quality.CRB.gearhead',
  guts = 'quality.CRB.guts',
  hardening = 'quality.CRB.hardening',
  highPainTolerance = 'quality.CRB.highPainTolerance',
  homeGround = 'quality.CRB.homeGround',
  humanLooking = 'quality.CRB.humanLooking',
  indomitable = 'quality.CRB.indomitable',
  juryrigger = 'quality.CRB.juryrigger',
  longReach = 'quality.CRB.longReach',
  lowLightVision = 'quality.CRB.lowLightVision',
  magicResistance = 'quality.CRB.magicResistance',
  mentorSpirit = 'quality.CRB.mentorSpirit',
  photographicMemory = 'quality.CRB.photographicMemory',
  quickHealer = 'quality.CRB.quickHealer',
  resistanceToPathogens = 'quality.CRB.resistanceToPathogens',
  spiritSpriteAffinity = 'quality.CRB.spiritSpriteAffinity',
  thermographicVision = 'quality.CRB.thermographicVision',
  toughness = 'quality.CRB.toughness',
  toxinResistance = 'quality.CRB.toxinResistance',
  willToLive = 'quality.CRB.willToLive',

  // Negative Qualities
  addiction = 'quality.CRB.addiction',
  allergy = 'quality.CRB.allergy',
  arVertigo = 'quality.CRB.arVertigo',
  astralBeacon = 'quality.CRB.astralBeacon',
  badLuck = 'quality.CRB.badLuck',
  badRep = 'quality.CRB.badRep',
  combatParalysis = 'quality.CRB.combatParalysis',
  dependents = 'quality.CRB.dependents',
  distinctiveStyle = 'quality.CRB.distinctiveStyle',
  elfPoser = 'quality.CRB.elfPoser',
  glassJaw = 'quality.CRB.glassJaw',
  gremlins = 'quality.CRB.gremlins',
  honorbound = 'quality.CRB.honorbound',
  impairedAttr = 'quality.CRB.impairedAttr',
  incompetentSkill = 'quality.CRB.incompetentSkill',
  inDebt = 'quality.CRB.inDebt',
  insomnia = 'quality.CRB.insomnia',
  lossOfConfidence = 'quality.CRB.lossOfConfidence',
  lowPainTolerance = 'quality.CRB.lowPainTolerance',
  orkPoser = 'quality.CRB.orkPoser',
  prejudiced = 'quality.CRB.prejudiced',
  scorched = 'quality.CRB.scorched',
  sensitiveSystem = 'quality.CRB.sensitiveSystem',
  simsenseVertigo = 'quality.CRB.simsenseVertigo',
  sinner = 'quality.CRB.sinner',
  socialStress = 'quality.CRB.socialStress',
  spiritSpriteBane = 'quality.CRB.spiritSpriteBan',
  uncouth = 'quality.CRB.uncouth',
  uneducated = 'quality.CRB.uneducated',
  unsteadyHands = 'quality.CRB.unsteadyHands',
  weakImmuneSystem = 'quality.CRB.weakImmuneSystem',
}

export const Qualities: Record<QualityId, Quality> = {
  // Positive Qualities
  [QualityIds.ambidextrous]: {
    id: QualityIds.ambidextrous,
    name: 'Ambidextrous',
    cost: 4,
    gameEffect: 'No penalty for off-hand weapon use (CRB p110).',
    source: { book: 'CRB', page: 70 },
  },
  [QualityIds.analyticalMind]: {
    id: QualityIds.analyticalMind,
    name: 'Analytical Mind',
    cost: 3,
    gameEffect: 'You gain a bonus Edge whe you make any Logic-based test.',
    source: { book: 'CRB', page: 70 },
  },
  [QualityIds.aptitude]: {
    id: QualityIds.aptitude,
    name: 'Aptitude (Skill)',
    cost: 12,
    source: { book: 'CRB', page: 70 },
    gameEffect: `
      Your skill maximum for the selected skill is 10, instead of 9, and your 
      maximum starting rank is 7, instead of 6,
    `,
    options: { skill: true },
    getName: ({ skill = '(Skill)' }) => `${skill} Resistance`,
    getEffects: ({ skill = '' }) => [
      { type: EffectType.skillMaxAdj, skill: skill || '', value: 1 },
    ],
  },
  [QualityIds.astralChameleon]: {
    id: QualityIds.astralChameleon,
    name: 'Astral Chameleon',
    cost: 9,
    source: { book: 'CRB', page: 70 },
    gameEffect: `
      Characters receive –2 dice on tests to recognize your aura or astral 
      signature. Your astral signature fades in half the normal time (CRB p159).
    `,
  },
  [QualityIds.blandness]: {
    id: QualityIds.blandness,
    name: 'Blandness',
    cost: 8,
    source: { book: 'CRB', page: 70 },
    gameEffect: `
      Characters take a –2 penalty on Memory tests (CRB p67) to remember if they 
      have seen you before, and the threshold on tests to notice if you are 
      following or observing them is increased by 1. If the character acquires 
      something permanent and distinctive—obvious, unusual cyberware, a unique 
      tattoo, that sort of thing—they lose this quality. If they acquire 
      something temporarily distinctive, such as an extreme hairdo, the effects 
      are negated until those changes are reversed.
    `,
  },
  [QualityIds.builtTough]: {
    id: QualityIds.builtTough,
    name: 'Built Tough',
    cost: 4,
    source: { book: 'CRB', page: 70 },
    gameEffect: `
      You have a number of additional boxes on your Physical Condition Monitor 
      equal to the rank of this quality
    `,
    maxRank: 4,
    options: {
      level: true,
    },
    getEffects: ({ level = 1 }) => [
      { type: EffectType.dmgTrackAdj, track: DamageType.charPhysical, value: level },
    ],
  },
  [QualityIds.catlike]: {
    id: QualityIds.catlike,
    name: 'Catlike',
    cost: 12,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      You gain a bonus Edge on all tests for balance, falling, and landing safely. 
      Note the rules on Preventing Edge Abuse, CRB p45.
    `,
  },
  [QualityIds.dermalDeposits]: {
    id: QualityIds.dermalDeposits,
    name: 'Dermal Deposits',
    cost: 7,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
     You gain 1 level of natural Armor. Your Unarmed Melee attacks inflict 
     Physical damage
    `,
    getEffects: () => [
      { type: EffectType.defRatingAdj, value: 1 },
    ],
  },
  [QualityIds.doubleJointed]: {
    id: QualityIds.doubleJointed,
    name: 'Double Jointed',
    cost: 12,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      You gain a bonus Edge on all tests involving grappling, escaping bonds, 
      flexibility, or fitting into tight spaces. Note the rules on Preventing 
      Edge Abuse, CRB p45.
    `,
  },
  [QualityIds.elementalResistance]: {
    id: QualityIds.elementalResistance,
    name: '(Elemental) Resistance',
    getName: ({ element = '(Element)' }) => `${element} Resistance`,
    cost: 12,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      When attacked with a weapon or spell (including unarmed combat by a spirit)
      that does this form of damage, gain a point of Edge before making your 
      Defense test.
    `,
    options: { element: true },
  },
  [QualityIds.exceptional]: {
    id: QualityIds.exceptional,
    name: 'Exceptional (Attribute)',
    getName: ({ attr = '(Attribute)' }) => `Exceptional ${attr}`,
    cost: 12,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      Select a Physical or Mental attribute. That attribute's maximum (but not
      current) rank increases by 1. This quality can only be purchased once per
      attribute.
    `,
    options: { attr: true },
    getEffects: ({ attr = '' }) => [
      { type: EffectType.attrMaxBonus, attr, value: 1 },
    ],
  },
  [QualityIds.firstImpression]: {
    id: QualityIds.firstImpression,
    name: 'First Impression',
    cost: 12,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      You gain 2 Edge for Social Tests during your first meeting with anyone,
      and both your Heat and Reputation are ignored for this first encounter.
    `,
  },
  [QualityIds.focusedConcentration]: {
    id: QualityIds.focusedConcentration,
    name: 'Focused Concentration',
    cost: 12,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      You can sustain multiple spells or complex forms without penalty. For each
      level, you can sustain 1 additional spell or complex form without 
      suffering the associated penalty. The spell cannot have a modified Drain 
      Value of 7 or greater
    `,
    maxRank: 3,
    options: { attr: true },
  },
  [QualityIds.gearhead]: {
    id: QualityIds.gearhead,
    name: 'Gearhead',
    cost: 10,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      You gain an Edge on Repair tests for any vehicle and can spend Edge 
      during downtime to make Extended Repair tests.
    `,
  },
  [QualityIds.guts]: {
    id: QualityIds.guts,
    name: 'Guts',
    cost: 12,
    source: { book: 'CRB', page: 71 },
    gameEffect: `
      You gain an Edge when resisting Intimidation or effects that cause the
      Frightened status.
    `,
  },
  [QualityIds.hardening]: {
    id: QualityIds.hardening,
    name: 'Hardening',
    cost: 10,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      You gain a bonus Edge when making Matrix Damage Resistance tests. If you 
      do not use that point of Edge immediately on the Damage Resistance test, 
      it goes away. When struck by any damage in the Matrix, you can convert up
      to two boxes to Stun Damage, rather than Matrix damage, protecting your 
      persona at the cost of yourself.
    `,
  },
  [QualityIds.highPainTolerance]: {
    id: QualityIds.highPainTolerance,
    name: 'High Pain Tolerance',
    cost: 7,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      When wounded, reduce your wound penalty by one (to a minimum of 0)
    `,
    getEffects: () => [
      { type: EffectType.woundPenaltyAdj, value: 1 },
    ],
  },
  [QualityIds.homeGround]: {
    id: QualityIds.homeGround,
    name: 'Home Ground',
    cost: 10,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      Select a neighborhood or Matrix host each time you take this quality. 
      Outdoors and Perception tests made in your Home Ground gain an Edge for
      use on that test; if you do not use the Edge on that test, it goes away.
    `,
  },
  [QualityIds.humanLooking]: {
    id: QualityIds.humanLooking,
    name: 'Human-Looking',
    cost: 8,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      You generally appear human at first glance and gain +2 dice on Disguise
      tests to hide your metatype and appear more human.
    `,
  },
  [QualityIds.indomitable]: {
    id: QualityIds.indomitable,
    name: 'Indomitable',
    cost: 12,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      Edge Boost costs are reduced by 1 on tests involving Willpower
    `,
  },
  [QualityIds.juryrigger]: {
    id: QualityIds.juryrigger,
    name: 'Juryrigger',
    cost: 12,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      When performing a Juryrigging test (see CRB p95), you gain a point of Edge that must 
      be spent on that test, or it goes away.
    `,
  },
  [QualityIds.longReach]: {
    id: QualityIds.longReach,
    name: 'Long Reach',
    cost: 12,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      When you are using a melee weapon, Close range is extended to 5 meters 
      instead of 3.
    `,
  },
  [QualityIds.lowLightVision]: {
    id: QualityIds.lowLightVision,
    name: 'Low-Light Vision',
    cost: 6,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      You can see clearly in any light level that is not total darkness
      (See Environment and Visibility, CRB p118).
    `,
  },
  [QualityIds.magicResistance]: {
    id: QualityIds.magicResistance,
    name: 'Magic Resistance',
    cost: 8,
    source: { book: 'CRB', page: 72 },
    gameEffect: `
      You gain a bonus Edge for use on any Magic Resistance test; if you do not
      use it on that test, that point goes away. When a Health spell is cast on
      you, treat your Essence as if it were 2 points lower than it actually is.
    `,
  },
  [QualityIds.mentorSpirit]: {
    id: QualityIds.mentorSpirit,
    name: 'Mentor Spirit',
    cost: 10,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      You gain the benefits listed with the description of your mentor spirit 
      (CRB p162). If you fail to keep aligned with one of those tenets, you lose
      your faith and connection to your mentor and all associated bonuses.
    `,
  },
  [QualityIds.photographicMemory]: {
    id: QualityIds.photographicMemory,
    name: 'Photographic Memory',
    cost: 12,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      You gain a bonus Edge point when making a Memory test (CRB p67). If you do
      not use this point of Edge on the test, it goes away
    `,
  },
  [QualityIds.quickHealer]: {
    id: QualityIds.quickHealer,
    name: 'Quick Healer',
    cost: 8,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      Cut the interval for any natural healing test (CRB p120) in half, meaning
      you can heal Stun Damage after half an hour and Physical Damage after half
      a day.
    `,
  },
  [QualityIds.resistanceToPathogens]: {
    id: QualityIds.resistanceToPathogens,
    name: 'Resistance to Pathogens',
    cost: 12,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      You gain a bonus point of Edge when you make a Pathogen Resistance test.
      If you do not use it on that test, it goes away.
    `,
  },
  [QualityIds.spiritSpriteAffinity]: {
    id: QualityIds.spiritSpriteAffinity,
    name: 'Spirit/Sprite Affinity',
    getName: ({ spirit = 'Spirit' }) => `${spirit} Affinity`,
    cost: 14,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      When selecting this quality, choose a type of spirit or sprite. You gain a
      bonus point of Edge when making a Conjuring or Tasking test for your
      chosen class of spirits/sprites. This quality can be taken multiple times,
      selecting a new class of spirits/sprites each time.
    `,
    options: { spirit: true },
  },
  [QualityIds.thermographicVision]: {
    id: QualityIds.thermographicVision,
    name: 'Thermographic Vision',
    cost: 8,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      You can see the heat of objects in total darkness (assuming they are 
      warmer or colder than the ambient temperature), allowing you to operate 
      in such conditions.
    `,
  },
  [QualityIds.toughness]: {
    id: QualityIds.toughness,
    name: 'Toughness',
    cost: 12,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      You gain a bonus point of Edge when making Damage Resistance tests. If
      you do not use it on the test, it goes away.
    `,
  },
  [QualityIds.toxinResistance]: {
    id: QualityIds.toxinResistance,
    name: 'Toxin Resistance',
    cost: 12,
    source: { book: 'CRB', page: 73 },
    gameEffect: `
      You gain a bonus point of Edge when you make a Toxin Resistance test 
      (CRB p121). If you do not use it on that test, it goes away.
    `,
  },
  [QualityIds.willToLive]: {
    id: QualityIds.willToLive,
    name: 'Will to Live',
    cost: 8,
    source: { book: 'CRB', page: 74 },
    maxRank: 3,
    gameEffect: `
      For every rank of this quality you possess, you gain two additional Damage
      Overflow boxes (see p. 121).
    `,
  },

  // Negative Qualities
  [QualityIds.addiction]: {
    id: QualityIds.addiction,
    name: 'Addiction',
    bonus: 2,
    source: { book: 'CRB', page: 74 },
    maxRank: 6,
    options: { level: true },
    gameEffect: `
      You cannot earn Edge or spend Edge in any form while suffering withdrawal. 
      Withdrawal times (the time that passes before you need your next hit) and 
      requirements are based on the level of addiction and can be found on the 
      Addiction Withdrawal table. When in withdrawal, take a –2 dicepool penalty 
      on all tests; increase that penalty by 1 each time you pass another 
      Withdrawal time period.
    `,
  },
  [QualityIds.allergy]: {
    id: QualityIds.allergy,
    name: 'Allergy',
    bonus: 20,
    source: { book: 'CRB', page: 74 },
    options: { level: true },
    gameEffect: `
      Select an allergen and severity to determine Karma value. You cannot spend
      addiction withdrawal table or earn Edge while exposed to your allergen.
      You also suffer secondary effects.
    `,
  },
  [QualityIds.arVertigo]: {
    id: QualityIds.arVertigo,
    name: 'Ar Vertigo',
    bonus: 10,
    source: { book: 'CRB', page: 75 },
    gameEffect: `
      You cannot gain or spend Edge while utilizing AR of any sort. You also
      gain the Nauseated status (CRB p52) while using AR and for one hour after
      you exit it.
    `,
  },
  [QualityIds.astralBeacon]: {
    id: QualityIds.astralBeacon,
    name: 'Astral Beacon',
    bonus: 10,
    source: { book: 'CRB', page: 75 },
    gameEffect: `
      You are considered Untrained for all Stealth tests in the astral plane. 
      You can never take the masking metamagic. Assensing tests made against 
      you get a free Edge, and all thresholds are reduced by 1. Astral Tracking 
      tests made against you gain 2 Edge, and all thresholds are reduced by half.
    `,
  },
  [QualityIds.badLuck]: {
    id: QualityIds.badLuck,
    name: 'Bad Luck',
    bonus: 10,
    source: { book: 'CRB', page: 75 },
    gameEffect: `
      Glitches occur more frequently. Count dice showing both 1 and 2 for
      determining a glitch. This does not affect critical glitches, only
      regular glitches.
    `,
  },
  [QualityIds.badRep]: {
    id: QualityIds.badRep,
    name: 'Bad Rep',
    bonus: 8,
    source: { book: 'CRB', page: 75 },
    gameEffect: `
      You cannot spend Edge on Social tests. If you engage in a Teamwork test 
      to assist a Social test, no one can spend Edge, and the opposing 
      individual gains a point of Edge.
    `,
  },
  [QualityIds.combatParalysis]: {
    id: QualityIds.combatParalysis,
    name: 'Combat Paralysis',
    bonus: 8,
    source: { book: 'CRB', page: 75 },
    gameEffect: `
      You cannot spend Edge on Social tests. If you engage in a Teamwork test 
      to assist a Social test, no one can spend Edge, and the opposing
      individual gains a point of Edge.
    `,
  },
  [QualityIds.dependents]: {
    id: QualityIds.dependents,
    name: 'Dependents',
    bonus: 4,
    source: { book: 'CRB', page: 75 },
    maxRank: 3,
    options: { level: true },
    gameEffect: `
      Choose a level for the dependents. Level 1 dependents are the equivalent
      of a family member who does not live with allergy table you but still
      needs support. Five percent of any score goes to this person. Level 2
      dependents are more stable costs, like the support of a high-maintenance
      significant other, a child, or a small family. This level costs the runner
      10 percent of every score. Level 3 dependents are rare in the shadows, 
      because most runners don’t have a regular family and a second life outside
      the shadows, which is what this level entails. This level costs the runner
      25 percent of all their scores
    `,
  },
  [QualityIds.distinctiveStyle]: {
    id: QualityIds.distinctiveStyle,
    name: 'Distinctive Style',
    bonus: 6,
    source: { book: 'CRB', page: 76 },
    gameEffect: `
      You cannot gain or spend Edge when you’re not rocking your distinctive
      look. Others get a +2 dice pool bonus when conducting a Memory test
      (CRB p67) to recall your appearance or remember if they have seen you 
      before.
    `,
  },
  [QualityIds.elfPoser]: {
    id: QualityIds.elfPoser,
    name: 'Elf Poser',
    bonus: 6,
    source: { book: 'CRB', page: 76 },
    gameEffect: `
      Elves, orks, and trolls gain a point of Edge in Influence (Etiquette)
      tests made against you.
    `,
  },
  [QualityIds.glassJaw]: {
    id: QualityIds.glassJaw,
    name: 'Glass Jaw',
    bonus: 4,
    source: { book: 'CRB', page: 76 },
    gameEffect: `
      You have 1 less Stun Box for each level of this Quality, down to a
      minimum of 2.
    `,
    getEffects: ({ level = 1 }) => [
      { type: EffectType.dmgTrackAdj, track: DamageType.charStun, value: level * -1 },
    ],
  },
  [QualityIds.gremlins]: {
    id: QualityIds.gremlins,
    name: 'Gremlins',
    bonus: 6,
    source: { book: 'CRB', page: 76 },
    gameEffect: `
      Whenever you use any device, roll 2D6. If you get a 1 on either die, it
      means the device fails to function correctly and can be treated as a
      glitch. The device can be quickly reset with a Minor Action and used 
      again. Rolling snake eyes (double 1s) means the device fails 
      catastrophically, and the roll can be treated like a critical glitch. The 
      device is done  for good and you might be in for a bit of hurt from shock
      or biofeedback.
    `,
  },
  [QualityIds.honorbound]: {
    id: QualityIds.honorbound,
    name: 'Honorbound',
    bonus: 10,
    source: { book: 'CRB', page: 76 },
    gameEffect: `
     You cannot spend or earn Edge for twenty-four hours after you break a 
     tenet of your code. If the same tenet is broken multiple times or broken 
     again during the twenty-four hour period, each infraction adds another 
     forty-eight hours onto the initial twenty-four. If a different tenet is 
     broken, it’s twenty-four hours for that one added to any current 
     infractions, and the same rules apply for additional violations. See the 
     Honorbound sidebar for some sample codes and tenets.
    `,
  },
  [QualityIds.impairedAttr]: {
    id: QualityIds.impairedAttr,
    name: 'Impaired (Attribute)',
    getName: ({ attr = 'Attribute' }) => `Impaired ${attr}`,
    bonus: 8,
    source: { book: 'CRB', page: 76 },
    options: { level: true, attr: true },
    gameEffect: `
       For each level, the character’s maximum for the chosen attribute 
       decreases by 1, to a minimum of 2.
    `,
    getEffects: ({ attr = '', level = 1 }) => [
      { type: EffectType.attrMaxBonus, attr, value: level * -1 },
    ],
  },
  [QualityIds.incompetentSkill]: {
    id: QualityIds.incompetentSkill,
    name: 'Incompetent Skill',
    getName: ({ skill = 'skill' }) => `Impaired ${skill}`,
    bonus: 10,
    source: { book: 'CRB', page: 76 },
    gameEffect: `
      When this quality is chosen, select a skill. You are unable to gain ranks
      in the selected skill. You cannot be Incompetent in skills you have no
      chance to perform - so you cannot choose this quality for Magic skills if
      you do not have a Magic rating, and you cannot choose it for Tasking if
      you do not have a Resonance rating. This skill may only be selected once.
    `,
  },
  [QualityIds.inDebt]: {
    id: QualityIds.inDebt,
    name: 'In Debt',
    bonus: 0,
    source: { book: 'CRB', page: 77 },
    options: { level: true },
    gameEffect: `
      When you spend Karma for cash, every point of Karma you spend gets you 
      5,000 instead of 2,000 nuyen. Each point of Karma spent also puts you 
      5,000 nuyen into debt with someone very dangerous and capable of 
      collecting. You must pay a monthly interest rate of 500 nuyen per Karma 
      spent, in addition to any payment to the principal. If the interest is 
      not paid, the lenders come searching for you. The quality can be bought 
      off purely with money; if the principal is repaid the quality is 
      eliminated. This quality can be obtained only during character creation, 
      not during gameplay.
    `,
  },
  [QualityIds.insomnia]: {
    id: QualityIds.insomnia,
    name: 'Insomnia',
    bonus: 4,
    source: { book: 'CRB', page: 77 },
    gameEffect: `
      Without proper rest, you can’t regain Edge or spend it as you might like.
      Each day the runner must make a Body + Willpower (3) test to get a
      successful night of rest. If they fail, they cannot earn more than two
      Edge from any source that day. Also, they cannot spend more than 2 Edge
      on any given test. The purchase and use of a sleep regulator reduces the
      threshold on the test to 1. The runner can also purchase medication
      (50 nuyen/dose) that reduces the threshold to 2.
    `,
  },
  [QualityIds.lossOfConfidence]: {
    id: QualityIds.lossOfConfidence,
    name: 'Loss Of Confidence',
    bonus: 6,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      During any encounter, the runner must make a Willpower (2) test as a 
      Minor Action. Failure means they cannot earn or spend Edge for the entire 
      encounter.
    `,
  },
  [QualityIds.lowPainTolerance]: {
    id: QualityIds.lowPainTolerance,
    name: 'Low Pain Tolerance',
    bonus: 10,
    source: { book: 'CRB', page: 78 },
    gameEffect: 'All wound modifiers are doubled',
    getEffects: () => [
      { type: EffectType.woundPenaltyAdj, value: 'double' },
    ],
  },
  [QualityIds.orkPoser]: {
    id: QualityIds.orkPoser,
    name: 'Ork Poser',
    bonus: 6,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      Elves, orks, and trolls gain a point of Edge in Influence (Etiquette)
      tests made against you.
    `,
  },
  [QualityIds.prejudiced]: {
    id: QualityIds.prejudiced,
    name: 'Prejudiced (Group)',
    bonus: 8,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      Select a specific group or type of people. You are unable to gain or use 
      Edge while the object of your prejudice is present (unless you’re 
      directly opposing them).
    `,
  },
  [QualityIds.scorched]: {
    id: QualityIds.scorched,
    name: 'Scorched',
    bonus: 6,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      You cannot spend Edge while accessing the Matrix. This includes through
      use of commlinks, smartlinks, and any other source of data coming in from
      the ether.
    `,
  },
  [QualityIds.sensitiveSystem]: {
    id: QualityIds.sensitiveSystem,
    name: 'Sensitive System',
    bonus: 8,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      Essence costs are doubled for all cyberware, bioware, and nanoware. 
      Geneware suffers no ill effects. You cannot have this quality if you have
      a Magic or Resonance rating.
    `,
  },
  [QualityIds.simsenseVertigo]: {
    id: QualityIds.simsenseVertigo,
    name: 'Simsense Vertigo',
    bonus: 6,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      You cannot gain or spend Edge while accessing the Matrix via VR. You also
      receive the Nauseated status (CRB p52) for one hour after you log off the
      Matrix.
    `,
  },
  [QualityIds.sinner]: {
    id: QualityIds.sinner,
    name: 'Sinner',
    bonus: 8,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      You pay taxes to the issuer of your SIN, either a megacorporation or a 
      nation. This cost comes as a 10 percent increase in the cost of the 
      lifestyle associated with this SIN. Due to data within the Global SIN 
      Registry, you are easier to track or identify, giving opponents a point 
      of Edge every time they attempt a Trace Icon action against you.
    `,
  },
  [QualityIds.socialStress]: {
    id: QualityIds.socialStress,
    name: 'Social Stress',
    bonus: 8,
    source: { book: 'CRB', page: 78 },
    gameEffect: `
      Select a specific social stressor. When encountering your social
      stressor, you must make a Charisma (2) test as a Minor Action. Failure
      means you cannot earn or spend Edge until you succeed. You can choose
      not to take the test but if so, any tests made against you gain a bonus
      Edge.
    `,
  },
  [QualityIds.spiritSpriteBane]: {
    id: QualityIds.spiritSpriteBane,
    name: 'Spirit/Sprite Bane',
    getName: ({ spirit }) => `${spirit} Bane`,
    bonus: 12,
    source: { book: 'CRB', page: 79 },
    options: { spirit: true },
    gameEffect: `
      When selecting this quality, choose a type of spirit or sprite. 
      Spirits/sprites from that category gain a bonus point of Edge when you 
      attempt a Conjuring or Tasking test against them. This quality can be 
      taken multiple times, selecting a new class of spirits/sprites each time.
      In combat, spirits/sprites of the chosen type will attack you first and
      relentlessly, often to the point of savaging a dead body or bricking a
      deck if they have nothing else to do.
    `,
  },
  [QualityIds.uncouth]: {
    id: QualityIds.uncouth,
    name: 'Uncouth',
    bonus: 6,
    source: { book: 'CRB', page: 79 },
    gameEffect: 'You cannot spend Edge on any test using Charisma',
  },
  [QualityIds.uneducated]: {
    id: QualityIds.uneducated,
    name: 'Uneducated',
    bonus: 6,
    source: { book: 'CRB', page: 79 },
    gameEffect: 'You cannot spend Edge on any test using Logic.',
  },
  [QualityIds.unsteadyHands]: {
    id: QualityIds.unsteadyHands,
    name: 'Unsteady Hands',
    bonus: 4,
    source: { book: 'CRB', page: 79 },
    gameEffect: `
      You cannot spend Edge on any test using Agility that directly involves 
      your hands (that is, a Stealth test to pull off sleightof-hand would 
      directly involve the hands, as would an Attack test with any weapon held 
      in the hands, but an Athletics test involving running would not, even 
      though the hands are in motion while running).
    `,
  },
  [QualityIds.weakImmuneSystem]: {
    id: QualityIds.weakImmuneSystem,
    name: 'Weak Immune System',
    bonus: 8,
    source: { book: 'CRB', page: 79 },
    gameEffect: `
      You cannot spend Edge to resist the effects of an infection. The threshold
      for fighting off any infection you are exposed to is increased by 1. While
      suffering the ill effects of an illness, you suffer a –1 dice pool
      modifier to all tests.
    `,
  },
}
