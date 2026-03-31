import type { CharacterMigration } from "#/lib/storage/characters/CharacterMigration.ts"

type SpellV1 = {
  id: string
  name: string
  type: string
  range: string
  damage: string
  description?: string
}

type CharacterV1 = {
  version: string
  spells: SpellV1[]
}

type CharacterV2 = CharacterV1 & {
  spells: (SpellV1 & {
    category: string
    drainValueMod: number
    dealsDamage: boolean
    duration: string
    voluntaryTargetsOnly: boolean
  })[]
}

const v0_2_0: CharacterMigration<CharacterV1, CharacterV2> = {
  version: "0.2.0",
  up: (character) => ({
    ...character,
    version: "0.2.0",
    spells: (character.spells ?? []).map((spell) => ({
      category: "Combat",
      drainValueMod: 0,
      dealsDamage: false,
      duration: "Instantaneous",
      voluntaryTargetsOnly: false,
      ...spell,
    })),
  }),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const migrations: CharacterMigration<any, any>[] = [v0_2_0]
