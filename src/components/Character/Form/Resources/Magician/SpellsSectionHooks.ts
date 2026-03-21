import { CharacterBuilderHooks } from "#/components/Character/Form/CharacterBuilderHooks.ts"
import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import {
  isMagician,
  SpellsBpPerSpell,
} from "#/components/Character/Form/Resources/Magician/SpellsRequirements.ts"
import { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const useSpellsSlice = () => {
  return useCharacterBuilderStoreSlice(
    (state) => state.awakened.spells ?? [],
    (state, spells) => {
      state.awakened.spells = spells
      return state
    },
  )
}

export const useSpellsBuildPoints = () => {
  const awakeningType = CharacterBuilderHooks.useAwakeningType()
  const spells = useSpellsSlice()
  const spellcasting = CharacterBuilderHooks.useActiveSkillRating(
    SkillKey.spellcasting,
  )
  const ritualSpellcasting = CharacterBuilderHooks.useActiveSkillRating(
    SkillKey.ritualSpellcasting,
  )

  if (!isMagician(awakeningType)) {
    return { max: 0, used: 0 }
  }

  const max = Math.max(spellcasting, ritualSpellcasting) * 2
  const used = spells.state.length * SpellsBpPerSpell
  return { max, used }
}

export const useSpellsWarnings = () => {
  const magicAttribute = CharacterBuilderHooks.useAttrValue(AttributeKey.magic)
  const spellcasting = CharacterBuilderHooks.useActiveSkillRating(
    SkillKey.spellcasting,
  )
  const ritualSpellcasting = CharacterBuilderHooks.useActiveSkillRating(
    SkillKey.ritualSpellcasting,
  )

  const spellBp = useSpellsBuildPoints()

  const warnings: string[] = []

  if (spellcasting === 0 && ritualSpellcasting === 0) {
    warnings.push(
      "Spells require either Spellcasting or Ritual Spellcasting skill ratings. Purchase one of these skills to use spells.",
    )
    return warnings
  }

  if (magicAttribute === undefined) {
    warnings.push("Magic attribute is not set.")
  }

  if (spellBp.used > spellBp.max) {
    warnings.push(
      `You have used ${spellBp.used} BP on spells, but you only have ${spellBp.max} BP available. Either reduce the number of spells or increase your Spellcasting/Ritual Spellcasting skill ratings.`,
    )
  }

  return warnings
}
