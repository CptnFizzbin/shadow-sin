import { CharacterAttr } from '../Character/CharacterAttr'
import { ActiveSkillName } from './ActiveSkillName'
import { Specializations } from './Specializations'

export interface ActiveSkill {
  name: ActiveSkillName
  untrained: boolean
  attr: CharacterAttr
  altAttr?: CharacterAttr
  specializations: string[]
  multiSpecialization?: boolean
}

export const activeSkills: Record<ActiveSkillName, ActiveSkill> = {
  [ActiveSkillName.astral]: {
    name: ActiveSkillName.astral,
    untrained: false,
    attr: CharacterAttr.intuition,
    specializations: Object.values(Specializations.Astral),
  },
  [ActiveSkillName.athletics]: {
    name: ActiveSkillName.athletics,
    untrained: true,
    attr: CharacterAttr.agility,
    altAttr: CharacterAttr.strength,
    specializations: Object.values(Specializations.Athletics),
  },
  [ActiveSkillName.biotech]: {
    name: ActiveSkillName.biotech,
    untrained: false,
    attr: CharacterAttr.logic,
    altAttr: CharacterAttr.intuition,
    specializations: Object.values(Specializations.Biotech),
  },
  [ActiveSkillName.closeCombat]: {
    name: ActiveSkillName.closeCombat,
    untrained: true,
    attr: CharacterAttr.agility,
    specializations: Object.values(Specializations.CloseCombat),
  },
  [ActiveSkillName.con]: {
    name: ActiveSkillName.con,
    untrained: true,
    attr: CharacterAttr.charisma,
    specializations: Object.values(Specializations.Con),
  },
  [ActiveSkillName.conjuring]: {
    name: ActiveSkillName.conjuring,
    untrained: false,
    attr: CharacterAttr.magic,
    specializations: Object.values(Specializations.Conjuring),
  },
  [ActiveSkillName.cracking]: {
    name: ActiveSkillName.cracking,
    untrained: false,
    attr: CharacterAttr.logic,
    specializations: Object.values(Specializations.Cracking),
  },
  [ActiveSkillName.electronics]: {
    name: ActiveSkillName.electronics,
    untrained: true,
    attr: CharacterAttr.logic,
    altAttr: CharacterAttr.intuition,
    specializations: Object.values(Specializations.Electronics),
  },
  [ActiveSkillName.enchanting]: {
    name: ActiveSkillName.enchanting,
    untrained: false,
    attr: CharacterAttr.magic,
    specializations: Object.values(Specializations.Enchanting),
  },
  [ActiveSkillName.engineering]: {
    name: ActiveSkillName.engineering,
    untrained: true,
    attr: CharacterAttr.logic,
    altAttr: CharacterAttr.intuition,
    specializations: Object.values(Specializations.Engineering),
  },
  [ActiveSkillName.exoticWeapons]: {
    name: ActiveSkillName.exoticWeapons,
    untrained: false,
    attr: CharacterAttr.agility,
    multiSpecialization: true,
    specializations: Object.values(Specializations.ExoticWeapons),
  },
  [ActiveSkillName.firearms]: {
    name: ActiveSkillName.firearms,
    untrained: true,
    attr: CharacterAttr.agility,
    specializations: Object.values(Specializations.Firearms),
  },
  [ActiveSkillName.influence]: {
    name: ActiveSkillName.influence,
    untrained: true,
    attr: CharacterAttr.charisma,
    altAttr: CharacterAttr.logic,
    specializations: Object.values(Specializations.Influence),
  },
  [ActiveSkillName.outdoors]: {
    name: ActiveSkillName.outdoors,
    untrained: true,
    attr: CharacterAttr.intuition,
    specializations: Object.values(Specializations.Outdoors),
  },
  [ActiveSkillName.perception]: {
    name: ActiveSkillName.perception,
    untrained: true,
    attr: CharacterAttr.intuition,
    altAttr: CharacterAttr.logic,
    specializations: Object.values(Specializations.Perception),
  },
  [ActiveSkillName.piloting]: {
    name: ActiveSkillName.piloting,
    untrained: true,
    attr: CharacterAttr.reaction,
    specializations: Object.values(Specializations.Piloting),
  },
  [ActiveSkillName.sorcery]: {
    name: ActiveSkillName.sorcery,
    untrained: false,
    attr: CharacterAttr.magic,
    specializations: Object.values(Specializations.Sorcery),
  },
  [ActiveSkillName.stealth]: {
    name: ActiveSkillName.stealth,
    untrained: true,
    attr: CharacterAttr.agility,
    specializations: Object.values(Specializations.Stealth),
  },
  [ActiveSkillName.tasking]: {
    name: ActiveSkillName.tasking,
    untrained: false,
    attr: CharacterAttr.resonance,
    specializations: Object.values(Specializations.Tasking),
  },
}
