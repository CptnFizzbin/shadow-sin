import { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type {CharacterSheet} from "#/lib/system/types/characterSheet.ts";
import {

  CharacterSheetVersion
} from "#/lib/system/types/characterSheet.ts"

export const CharacterSheetFactory = {
  create(): CharacterSheet {
    return {
      id: crypto.randomUUID(),
      version: CharacterSheetVersion,

      profile: {
        alias: "",
        name: "",
        archetype: undefined,
        streetCred: 0,
        notoriety: 0,
        description: undefined,
        personality: undefined,
        lifestyle: undefined,
      },

      biology: {
        metatype: MetatypeKey.Human,
        awakening: AwakeningType.Mundane,
        gender: undefined,
        age: undefined,
        weight: undefined,
        height: undefined,
      },

      karma: {
        total: 0,
        current: 0,
      },

      nuyen: {
        current: 0,
        loans: [],
      },

      edge: {
        current: 0,
      },

      damage: {
        physical: 0,
        stun: 0,
        matrix: 0,
      },

      attributes: {
        body: 0,
        agility: 0,
        reaction: 0,
        strength: 0,

        charisma: 0,
        intuition: 0,
        logic: 0,
        willpower: 0,

        magic: 0,
        edge: 0,
        resonance: 0,
        essence: 6,
      },

      qualities: [],
      skills: {},
      gear: {},
      contacts: [],
    }
  },
}
