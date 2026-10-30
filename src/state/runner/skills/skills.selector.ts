import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { SourcedGameEffectSelectors } from "#/state/runner/gameEffects/gameEffects.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import type { RatingBreakdown, RatingModifier } from "#/system/formulas/ratings/ratingFormulas.ts"
import { RatingFormulas } from "#/system/formulas/ratings/ratingFormulas.ts"
import { isEntityWithSkills } from "#/system/model/entities/traits/entityWithSkills.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { isRunnerWithBiology } from "#/system/model/runnerTraits.ts"
import type { SkillInfo } from "#/system/model/skills/skillInfo.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"
import { SRC } from "#/system/model/systemValues.ts"

export namespace SkillsSelectors {

  export const selectActiveSkills = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.activeSkills,
  )

  export const selectSkillGroups = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.skillGroups,
  )

  export const selectKnowledgeSkills = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.knowledgeSkills,
  )

  export const selectLanguageSkills = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.languageSkills,
  )

  export const selectAllowedActive = createMemoizedSelector(
    BiologySelectors.selectAwakening,
    (awakeningType) => {
      const skillEntries = Object.entries(skillList)
        .filter(([_, info]) => {
          if (!info.awakening) return true
          return info.awakening.includes(awakeningType)
        })

      return Object.fromEntries(skillEntries) as Partial<Record<SkillKey, SkillInfo>>
    },
  )

  /** The rating for `skill` before any modifiers apply: the higher of its own rating and its skill group's. */
  export const selectRawValue = createMemoizedSelector(
    selectActiveSkills,
    selectSkillGroups,
    SelectorOptions.skill,
    (activeSkills, skillGroups, skill): number => {
      const skillInfo = skillList[skill]
      const skillRating = activeSkills.find((s) => s.name === skill)?.rating ?? 0
      const groupRating = skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
      return Math.max(skillRating, groupRating, 0)
    },
  )

  /** @deprecated - use {@link selectRawValue} (before modifiers) or {@link selectRating} (after) instead */
  export const selectValue = (state: { entity: object }, { skillName }: { skillName: SkillKey }): number =>
    selectRawValue(state, { skill: skillName })

  const selectModifiers = createMemoizedSelector(
    ViewerStateSelectors.selectEntity,
    SourcedGameEffectSelectors.selectAll,
    SelectorOptions.skill,
    (entity, sourcedEffects, skill): RatingModifier[] =>
      // GameEffects belong to the Runner, so they only modify the Runner's own skills.
      isRunnerWithBiology(entity)
        ? RatingFormulas.getModifiers({ sourcedEffects, type: GameEffectType.skillMod, target: skill })
        : [],
  )

  /** The rating for `skill` with the raw value and named modifiers it was computed from. */
  export const selectRatingBreakdown = createMemoizedSelector(
    selectRawValue,
    selectModifiers,
    (rawValue, modifiers): RatingBreakdown => RatingFormulas.getSkillRating({ rawValue, modifiers }),
  )

  /** The rating for `skill` used in tests and dice pools: its raw value plus active `skillMod` modifiers. */
  export const selectRating = createMemoizedSelector(
    selectRatingBreakdown,
    (breakdown) => breakdown.rating,
  )

  /**
   * A Specialization's bonus for `skill` with the named `skillSpecializationMod` modifiers that
   * add to it. Empty when no `specialization` is given.
   */
  export const selectSpecializationBreakdown = createMemoizedSelector(
    ViewerStateSelectors.selectEntity,
    SourcedGameEffectSelectors.selectAll,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    (entity, sourcedEffects, skill, specialization): RatingBreakdown | undefined => {
      if (!specialization) return undefined
      const modifiers = isRunnerWithBiology(entity)
        ? RatingFormulas.getModifiers({
            sourcedEffects,
            type: GameEffectType.skillSpecializationMod,
            target: skill,
            subTarget: specialization,
          })
        : []
      return RatingFormulas.getSkillRating({ rawValue: SRC.Skills.Specialization.Modifier, modifiers })
    },
  )

  export const selectSpecialization = createMemoizedSelector(
    selectActiveSkills,
    SelectorOptions.skillName,
    (activeSkills, skillName) => activeSkills.find((s) => s.name === skillName)?.specialization,
  )

  export const selectActiveSkill = createMemoizedSelector(
    selectActiveSkills,
    SelectorOptions.skillName,
    selectValue,
    (activeSkills, skill, value) => {
      const skillData = activeSkills.find((s) => s.name === skill)
      return {
        name: skill,
        rating: skillData?.rating ?? 0,
        specialization: skillData?.specialization,
        attr: skillList[skill].attr,
        value: value,
      }
    },
  )
}
