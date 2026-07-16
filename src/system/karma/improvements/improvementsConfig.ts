/**
 * Karma cost constants for every post-chargen improvement (SR4A p. 269–271
 * Advancement Table, plus Runner's Companion quality rules and this app's
 * Initiation/Submersion formula). Single source of truth consumed by
 * `getImprovementCost` and by improvement-list UI previewing a cost before an
 * entry is queued. See `docs/features/0010-spend-karma.md`.
 */
export const improvementsConfig = {
  attribute: {
    /** Karma per step = new rating × this multiplier. */
    karmaMultiplier: 5,
  },
  activeSkill: {
    karmaMultiplier: 2,
    newSkillCost: 4,
  },
  skillGroup: {
    karmaMultiplier: 5,
    newGroupCost: 10,
  },
  knowledgeSkill: {
    karmaMultiplier: 1,
    newSkillCost: 2,
  },
  languageSkill: {
    karmaMultiplier: 1,
    newSkillCost: 2,
  },
  specialization: {
    cost: 2,
  },
  spell: {
    newSpellCost: 5,
  },
  complexForm: {
    karmaMultiplier: 1,
    newFormCost: 2,
  },
  quality: {
    /** Both a new positive quality and a negative-quality buy-off cost BP value × this. */
    karmaPerBp: 2,
  },
  /** Same formula currently used for both Initiation and Submersion. */
  initiateGrade: {
    base: 10,
    perGrade: 3,
  },
  submersionGrade: {
    base: 10,
    perGrade: 3,
  },
} as const
