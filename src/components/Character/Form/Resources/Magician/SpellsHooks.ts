import {
  useBuilderActiveSkillRating,
  useBuilderAttrValue,
  useBuilderAwakeningType,
} from "#/components/Character/Form/CharacterBuilderHooks.ts"
import {
  isMagician,
  SpellsBpPerSpell,
} from "#/components/Character/Form/Resources/Magician/SpellsUtils.ts"
import { useBuilderStoreSlice } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const useSpellsSlice = () => {
  return useBuilderStoreSlice(
    (state) => state.awakened.spells ?? [],
    (state, spells) => {
      state.awakened.spells = spells
      return state
    },
  )
}

export const useSpellsBuildPoints = () => {
  const awakeningType = useBuilderAwakeningType()
  const spells = useSpellsSlice()
  const spellcasting = useBuilderActiveSkillRating(SkillKey.spellcasting)
  const ritualSpellcasting = useBuilderActiveSkillRating(
    SkillKey.ritualSpellcasting,
  )

  if (!isMagician(awakeningType)) {
    return { allowance: 0, spent: 0 }
  }

  const allowance = Math.max(spellcasting, ritualSpellcasting) * 2
  const spent = spells.state.length * SpellsBpPerSpell
  return { allowance, spent }
}

export const useSpellsWarnings = () => {
  const magicAttribute = useBuilderAttrValue(AttributeKey.magic)
  const spellcasting = useBuilderActiveSkillRating(SkillKey.spellcasting)
  const ritualSpellcasting = useBuilderActiveSkillRating(
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

  if (spellBp.spent > spellBp.allowance) {
    warnings.push(
      `You have used ${spellBp.spent} BP on spells, but you only have ${spellBp.allowance} BP available. Either reduce the number of spells or increase your Spellcasting/Ritual Spellcasting skill ratings.`,
    )
  }

  return warnings
}
