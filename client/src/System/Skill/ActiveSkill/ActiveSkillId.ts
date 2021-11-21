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
  sorcery = 'sorcery',
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

export enum FirearmSpecialties {
  trasers = 'Tasers',
  holdOuts = 'Hold-Outs',
  lightPistols = 'Light Pistols',
  machinePistols = 'Machine Pistols',
  heavyPistols = 'Heavy Pistols',
  submachineGuns = 'Submachine Guns',
  shotguns = 'Shotguns',
  rifles = 'Rifles',
  machineGuns = 'Machine Guns',
  assaultCannon = 'Assault Cannon',
}
