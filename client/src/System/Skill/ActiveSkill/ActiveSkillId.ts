export type SkillNames = Record<string, string>

export enum ActiveSkillId {
  athletics = 'athletics',
  biotech = 'biotech',
  closeCombat = 'closeCombat',
  cracking = 'cracking',
  electronics = 'electronics',
  engineering = 'engineering',
  firearms = 'firearms',
  perception = 'perception',
  piloting = 'piloting',
  stealth = 'stealth',
}

let skillNames: SkillNames = {
  [ActiveSkillId.athletics]: 'Athletics',
  [ActiveSkillId.biotech]: 'Biotech',
  [ActiveSkillId.closeCombat]: 'Close Combat',
  [ActiveSkillId.cracking]: 'Cracking',
  [ActiveSkillId.electronics]: 'Electronics',
  [ActiveSkillId.engineering]: 'Engineering',
  [ActiveSkillId.firearms]: 'Firearms',
  [ActiveSkillId.perception]: 'Perception',
  [ActiveSkillId.piloting]: 'Piloting',
  [ActiveSkillId.stealth]: 'Stealth',
}

export const registerSkillNames = (names: SkillNames): void => {
  skillNames = { ...skillNames, ...names }
}

export const formatSkill = (skillId: string): string => {
  return skillNames[skillId] || skillId
}
