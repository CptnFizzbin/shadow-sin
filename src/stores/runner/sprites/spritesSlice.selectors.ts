import type { GameEffectsState } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export namespace SpriteSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.sprites,
  )

  /** {@link selectAll}, or empty for a runner who isn't a Technomancer. */
  export const selectVisible = createMemoizedSelector(
    BiologySelectors.selectAwakening,
    selectAll,
    (awakening, sprites) => awakening === AwakeningType.Technomancer ? sprites : [],
  )

  /** Max sprites a technomancer can have registered at once — their Charisma. */
  export const selectMaxRegistered = AttrSelectors.forAttr(AttributeKey.charisma).selectValue

  /** Max tasks a newly compiled sprite can be assigned — the technomancer's Compiling total
   *  (rating + Resonance + mods), same computation as `useActiveSkill(SkillKey.compiling)`. */
  export const selectMaxTasks = createMemoizedSelector(
    injectOption(SkillsSelectors.selectValue, { skillName: SkillKey.compiling }),
    AttrSelectors.forAttr(AttributeKey.resonance).selectValue,
    (state: GameEffectsState) => GameEffectSelectors.selectByType(state, { gameEffectType: GameEffectType.skillMod }),
    (skillRating, resonance, skillMods) => {
      const totalMod = skillMods
        .filter((effect) => effect.target === SkillKey.compiling)
        .reduce((sum, effect) => sum + effect.value, 0)
      return skillRating + resonance + totalMod
    },
  )
}
