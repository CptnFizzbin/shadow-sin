import { FocusType } from "#/system/magic/focusData.ts"
import type { QualityData } from "#/system/qualityData.ts"

export const ImprovementsConfig = {
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
}
