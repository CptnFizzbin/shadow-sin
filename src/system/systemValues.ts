import type { QualityData } from "./qualityData.ts"
import { FocusType } from "#/system/magic/focusData.ts"

export const SystemValues = {
  skills: {
    specialization: {
      modifier: 2,
    },

    defaulting: {
      modifier: -1,
    },
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
