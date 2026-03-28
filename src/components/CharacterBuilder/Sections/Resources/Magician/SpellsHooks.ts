import { useBuilderActiveSkillRating } from "#/components/CharacterBuilder/Hooks/UseBuilderActiveSkillRating.ts"
import { useBuilderAwakeningType } from "#/components/CharacterBuilder/Hooks/UseBuilderAwakeningType.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsUtils.ts"
import { useBuilderSpellsApi } from "#/components/CharacterBuilder/Sections/Resources/Magician/UseSpellsApi.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"

export const useSpellsBuildPoints = () => {
  const awakeningType = useBuilderAwakeningType()
  const { spells } = useBuilderSpellsApi()
  const spellcasting = useBuilderActiveSkillRating(SkillKey.spellcasting)
  const ritualSpellcasting = useBuilderActiveSkillRating(SkillKey.ritualSpellcasting)

  const allowance = (Math.max(spellcasting, ritualSpellcasting) * 2) * SpellsBpPerSpell
  const spent = spells.length * SpellsBpPerSpell

  return {
    label: "Spells",
    allowance,
    spent,
    enabled: isMagician(awakeningType),
  }
}
