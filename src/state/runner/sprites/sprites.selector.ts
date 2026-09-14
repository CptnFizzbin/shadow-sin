import type { GameEffectsState } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { AwakeningType } from "#/system/model/magic/awakeningType.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

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
