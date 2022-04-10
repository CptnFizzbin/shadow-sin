import { SpellCategory } from '../../../Spells/SpellCategory'
import { SpellData } from '../../../Spells/SpellData'
import { SpellType } from '../../../Spells/SpellType'

export const spells: SpellData[] = [
  {
    id: '3fe6eed8-76eb-4652-a5ca-46021d42a521',
    name: 'Increase Attribute',
    source: {book: 'CRB', page: 137},
    category: SpellCategory.Health,
    range: 'Touch',
    type: SpellType.Physical,
    duration: 'Sustained',
    drainValue: 3,
    effect: `
      The touch of the mage strengthens, speeds, or enlightens the target,
      temporarily raising one of their attributes. The caster decides which
      attribute to target before casting the spell. The caster rolls a
      Sorcery + Magic (5 - essence) test. They can select how many net hits
      they actually apply to the target to increase the selected attribute, 
      at a rate of 1 point of increase per net hit (maximum bonus +4); for
      each net hit applied beyond the first, the Drain Value of the spell
      increases by 1. The spell cannot affect Edge, Essence, Magic, or
      Resonance.
    `,
  },
  {
    id: 'fd112538-96cc-41cd-b20f-e9f0d83948ef',
    name: 'Increase Reflexes',
    source: {book: 'CRB', page: 137},
    category: SpellCategory.Health,
    range: 'Touch',
    type: SpellType.Physical,
    duration: 'Sustained',
    drainValue: 5,
    effect: `
      The reaction time and speed of the target increase, making them better 
      able to anticipate and respond to others. The caster rolls a Sorcery + 
      Magic (5 – Essence) test. They can select how many net hits they actually 
      apply to the target to increase both their Reaction score and the number 
      of Initiative Dice, at a rate of 1 point of increase and 1 Initiative Die 
      per net hit; for each net hit applied beyond the first, the Drain Value 
      of the spell increases by 1.
    `,
  },
  {
    id: 'e7cc9291-3f01-49c2-93c9-bb2c3221f23f',
    name: 'Heal',
    source: {book: 'CRB', page: 136},
    category: SpellCategory.Health,
    range: 'Touch',
    type: SpellType.Physical,
    duration: 'Permanent',
    drainValue: 3,
    effect: `
      Shadowrunning comes with bumps, bruises, and bullet wounds, and
      magic is perhaps the quickest and most effective way to repair it.
      When casting this spell, roll Sorcery + Magic with a threshold of (5 -
      Essence). Heal 1 box of Stun, Physical, or Overflow damage per net hit.
      Injuries can only be affected once by any Heal spell (including
      Cleansing Heal, Colling Heal, and Warming Heal).
    `,
  },
  {
    id: '9ac200ec-e301-401a-a1f4-a9cebbdadc0b',
    name: 'Invisibility',
    source: {book: 'CRB', page: 138},
    category: SpellCategory.Illusion,
    senseType: 'Single-Sense',
    range: 'Touch',
    type: SpellType.Mana,
    duration: 'Sustained',
    drainValue: 3,
    effect: `
      The target fades from view, becoming transparent so that they can move 
      unnoticed. Invisibility gives the targeted character the Invisible (#) 
      status (CRB p.52), where the number after the status becomes the threshold
      on any tests to see the character.
    `,
  },
  {
    id: '63f34c4d-adf0-4f94-ad60-63f8dc5ebd18',
    name: 'Ice Spear',
    source: {book: 'CRB', page: 138},
    category: SpellCategory.Combat,
    damageType: 'Indirect',
    range: 'LoS',
    type: SpellType.Physical,
    duration: 'Instant',
    drainValue: 5,
    area: false,
    damage: 'P, Special',
    effect: `
      When every corp security goon you run into starts wearing flame-retardant 
      underwear, it’s time to throw a changeup at them and hit them with the 
      other temperature extreme. These spells blast targets with freezing cold, 
      doing Cold elemental damage (CRB p.110) along with the normal damage and 
      imposing the Chilled status (CRB p.51) for a number of combat rounds equal 
      to net hits on the Spellcasting test.
    `,
  },
  {
    id: '9c04e99b-47b8-4cd6-bcc9-7bdefe27f327',
    name: 'Stunbolt',
    source: {book: 'CRB', page: 134},
    category: SpellCategory.Combat,
    damageType: 'Direct',
    range: 'LoS',
    type: SpellType.Mana,
    duration: 'Instant',
    drainValue: 3,
    area: false,
    damage: 'S',
    effect: `
      Sometimes you take a little off the heater to catch the other guy 
      off-balance. These spells channel mana in a way that hurts, but only to 
      stun.
    `,
  },
  {
    id: 'a22855a7-c4d8-456e-bc8a-ea333814991e',
    name: 'Stunball',
    source: {book: 'CRB', page: 134},
    category: SpellCategory.Combat,
    damageType: 'Indirect',
    range: 'LoS',
    type: SpellType.Mana,
    duration: 'Instant',
    drainValue: 4,
    area: true,
    damage: 'S',
    effect: `
      Sometimes you take a little off the heater to catch the other guy 
      off-balance. These spells channel mana in a way that hurts, but only to 
      stun.
    `,
  },
]
