import { FocusType } from "./magic/focusData.ts"
import type { QualityData } from "./qualityData.ts"

/**
 * Numeric constants defined by the Shadowrun 4th Edition rules — build point
 * costs, karma costs, dice pool modifiers, and similar values — grouped by
 * the domain each rule applies to. Values derived from runner data belong in
 * selectors/hooks, not here; this is only for the fixed numbers the rules
 * themselves specify.
 */
export const SystemValues = {
  skills: {
    specialization: {
      /** Dice pool bonus granted when a roll uses a skill's specialization. */
      modifier: 2,
    },

    /** Dice pool penalty applied when a test defaults to an untrained, defaultable skill. */
    defaulting: {
      modifier: -1,
    },

    /** Highest rating an Active Skill can reach without the Aptitude quality. */
    activeMaxRating: 6,
    /** Highest rating a Skill Group can reach. */
    groupMaxRating: 4,
  },

  dice: {
    /** Number of sides on a Shadowrun test die. */
    sides: 6,
    /** A die counts as a hit at this value or higher. */
    hitThreshold: 5,
    /** A die this value or higher explodes into an extra die (Rule of Six). */
    explodesOn: 6,
    /** A roll glitches when at least this fraction of the dice pool shows a 1. */
    glitchOnesFraction: 2,
  },

  damage: {
    // SR4A: Condition Monitor boxes = 8 + ceil(linked attribute ÷ 2).
    conditionMonitor: {
      base: 8,
      attributeDivisor: 2,
    },
    /** Boxes of damage between each wound modifier step, before Pain Tolerance effects. */
    baseWoundInterval: 3,
  },

  encumbrance: {
    // SR4A p.160: penalty is –1 to Agility and Reaction per 2 points (or fraction) either
    // armor rating exceeds Body × 2.
    bodyMultiplier: 2,
    penaltyDivisor: 2,
  },

  initiative: {
    /** Initiative Passes every character has before bonuses. */
    basePasses: 1,
  },

  builder: {
    buildPoints: {
      total: 400,
      unspentWarningThreshold: 5,
    },

    attributes: {
      bpAllowance: 200,
      bpCost: {
        base: 10,
        maxOut: 25,
      },
    },

    skills: {
      active: {
        bpCost: {
          perRating: 4,
          specialization: 2,
        },
      },
      group: {
        bpCost: {
          perRating: 10,
        },
      },
      knowledge: {
        freeSkillPointsPerAttribute: 3,
        maxSkillPointsPerAttribute: 6,
        spCost: {
          perRating: 1,
          specialization: 1,
        },
        bpCost: {
          extraSkillPoint: 2,
        },
      },
      language: {
        spCost: {
          perRating: 1,
          specialization: 1,
        },
      },
    },

    qualities: {
      maxNegativeBpBonus: 35,
    },

    magic: {
      spells: {
        bpCost: 3,
      },
    },

    technomancer: {
      complexForms: {
        bpCost: {
          perRating: 1,
        },
      },
      sprites: {
        bpCost: {
          perTask: 1,
        },
      },
    },

    contacts: {
      bpCost: {
        perConnection: 1,
        perLoyalty: 1,
      },
    },

    gear: {
      bpAllowance: 50,
      nuyenPerBp: 5_000,
    },
  },

  improvements: {
    // SR4A defaults (p. 87). The "optional rules" registry overrides can relax
    // these in a future slice; for now the defaults are hard-coded.
    caps: {
      activeSkill: 6,
      /** Active Skill cap for a runner with the Aptitude quality targeting that skill. */
      aptitudeActiveSkill: 7,
      skillGroup: 6,
      knowledgeSkill: 6,
      languageSkill: 6,
      /** Essence isn't a karma-spend target, but shares the standard attribute cap. */
      essenceAttribute: 6,
      /** Karma cost multiplier for raises past `activeSkill` for an Aptitude-boosted skill. */
      aptitudeCostMultiplier: 2,
    },

    skills: {
      active: {
        maxRating: 6,
        test: (newRating: number) => ({
          threshold: newRating * 2,
          interval: { weeks: 1 },
        }),
        karmaCost: {
          learnNew: 4,
          improve: (newRating: number) => newRating * 2,
          specialization: 2,
        },
      },
      group: {
        maxRating: 6,
        test: (newRating: number) => ({
          threshold: newRating * 2,
          interval: { months: 1 },
        }),
        karmaCost: {
          learnNew: 10,
          improve: (newRating: number) => newRating * 5,
          specialization: 2,
        },
      },
      knowledge: {
        maxRating: 6,
        test: (newRating: number) => ({
          threshold: newRating * 2,
          interval: { weeks: 1 },
        }),
        karmaCost: {
          learnNew: 2,
          improve: (newRating: number) => newRating,
          specialization: 2,
        },
      },
      language: {
        maxRating: 6,
        test: (newRating: number) => ({
          threshold: newRating * 2,
          interval: { weeks: 1 },
        }),
        karmaCost: {
          learnNew: 2,
          improve: (newRating: number) => newRating,
          specialization: 2,
        },
      },
    },

    attibutes: {
      karmaCost: {
        improve: (newRating: number) => newRating * 5,
      },
    },

    qualities: {
      positive: {
        allowsKaramDebt: true,
        karmaCost: {
          addQuality: (quality: QualityData) => {
            if (!quality.bpValue) return 0
            return quality.bpValue * 2
          },
        },
      },
      negative: {
        karamaCost: {
          removeQuality: (quality: QualityData) => {
            if (!quality.bpValue) return 0
            return quality.bpValue * 2
          },
        },
      },
    },

    magic: {
      spells: {
        karmaCost: {
          learnNew: 5,
        },
      },
      foci: {
        karmaCost: {
          bond: (type: FocusType, force: number) => {
            switch (type) {
              case FocusType.Spellcasting:
                return force * 4
              case FocusType.Counterspelling:
                return force * 3
              case FocusType.Sustaining:
                return force * 2
              case FocusType.Summoning:
                return force * 4
              case FocusType.Banishing:
                return force * 3
              case FocusType.Binding:
                return force * 3
              case FocusType.Weapon:
                return force * 3
              case FocusType.Power:
                return force * 8
            }
          },
        },
      },
      initiaition: {
        karamaCost: {
          improve: (newGrade: number) => 10 + newGrade * 3,
        },
      },
    },

    technomancer: {
      complexForms: {
        karamCost: {
          learnNew: 2,
          increase: (nextRating: number) => nextRating,
        },
      },
      submersion: {
        karamCost: {
          improve: (newGrade: number) => 10 + newGrade * 3,
        },
      },
    },
  },
}
