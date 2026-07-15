export const BuilderConfig = {
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
}
