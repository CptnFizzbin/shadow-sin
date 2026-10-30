import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import type { GameEffectsState } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { DicePoolFormulas } from "#/system/formulas/dicePool/dicePoolFormulas.ts"
import { filterByEffectType } from "#/system/formulas/gameEffects/gameEffectUtils.ts"
import { calculateArmorBulk, calculateEncumbrancePenalty } from "#/system/formulas/items/encumbranceUtils.ts"
import { AttributeKey, AttributeLabels } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"
import { SRC } from "#/system/model/systemValues.ts"

const selectSkillModTotal = createMemoizedSelector(
  GameEffectSelectors.selectAll,
  SelectorOptions.skill,
  (allEffects, skill) =>
    allEffects
      .filter(filterByEffectType(GameEffectType.skillMod))
      .filter((effect) => effect.target === skill)
      .reduce((sum, effect) => sum + effect.value, 0),
)

const selectSkillMods = (state: GameEffectsState) =>
  GameEffectSelectors.selectByType(state, { gameEffectType: GameEffectType.skillMod })

const selectSpecializationMods = (state: GameEffectsState) =>
  GameEffectSelectors.selectByType(state, { gameEffectType: GameEffectType.skillSpecializationMod })

const selectEncumbrancePenalty = createMemoizedSelector(
  ItemSelectors.Armor.selectEquipped,
  AttrSelectors.forAttr(AttributeKey.body).selectValue,
  (equippedArmor, body) => {
    const bulk = calculateArmorBulk(equippedArmor)
    return calculateEncumbrancePenalty(bulk.ballistic, bulk.impact, body)
  },
)

/** Adapts {@link AttrSelectors.selectValue}'s `key` option to this domain's `attr` option. */
const selectAttrValue = (
  state: Parameters<typeof AttrSelectors.selectValue>[0],
  { attr }: { attr: AttributeKey },
): number => AttrSelectors.selectValue(state, { key: attr })

const skillPoolId = (baseId: string, specialization?: string): string =>
  specialization ? `${baseId}.${specialization}` : baseId

const skillPoolName = (skillName: string, specialization?: string): string =>
  specialization ? `${skillName} (${specialization})` : skillName

export namespace DicePoolSelectors {
  /** An Attribute's rating as a single {@link DiceGroup}. */
  export const selectAttrGroup = createMemoizedSelector(
    selectAttrValue,
    SelectorOptions.attr,
    (attrValue, attr): DiceGroup => ({ name: AttributeLabels[attr], size: attrValue, type: "attribute" }),
  )

  /**
   * An Active Skill as a single {@link DiceGroup}: its rating with active `skillMod` GameEffects
   * folded in, or a Defaulting penalty when untrained (unless `excludeDefaulting` is set).
   */
  export const selectActiveSkillGroup = createMemoizedSelector(
    (state: EntityScope, { skill }: { skill: SkillKey }) => SkillsSelectors.selectValue(state, { skillName: skill }),
    selectSkillMods,
    SelectorOptions.skill,
    SelectorOptions.excludeDefaulting,
    (rating, skillMods, skill, excludeDefaulting): DiceGroup => {
      const modTotal = DicePoolFormulas.getSkillModTotal({ skillMods, skill })
      const { size, isDefaulting } = DicePoolFormulas.getActiveSkillDice({
        rating,
        modTotal,
        defaulting: !excludeDefaulting,
      })
      return isDefaulting
        ? { name: `${skill} - Defaulting`, size, type: "defaulting" }
        : { name: skill, size, type: "skill" }
    },
  )

  /** The Wound Modifier as a penalty {@link DiceGroup}, or `null` when uninjured. */
  export const selectWoundGroup = createMemoizedSelector(
    DamageSelectors.selectWoundMod,
    (woundMod): DiceGroup | null => woundMod === 0 ? null : { name: "Wound", size: woundMod * -1, type: "penalty" },
  )

  /** The armor Encumbrance penalty as a penalty {@link DiceGroup}, or `null` when unencumbered. */
  export const selectEncumbranceGroup = createMemoizedSelector(
    selectEncumbrancePenalty,
    (penalty): DiceGroup | null => penalty === 0 ? null : { name: "Encumbrance", size: penalty * -1, type: "penalty" },
  )

  /** The best equipped armor's `armorRating` as a single {@link DiceGroup}. */
  export const selectArmorGroup = createMemoizedSelector(
    ItemSelectors.Armor.selectEffective,
    SelectorOptions.armorRating,
    (ratings, armorRating): DiceGroup => ({ name: `Armor (${armorRating})`, size: ratings[armorRating] ?? 0 }),
  )

  /**
   * The full pool for an Active Skill test: the skill, its linked Attribute (or `attrOverride`),
   * the Specialization bonus when `specialization` is given, and the Wound Modifier.
   */
  export const selectActiveSkillPool = createMemoizedSelector(
    selectActiveSkillGroup,
    (state: EntityScope, { skill, attrOverride }: { skill: SkillKey, attrOverride?: AttributeKey }) =>
      selectAttrGroup(state, { attr: attrOverride ?? skillList[skill].attr }),
    selectSpecializationMods,
    selectWoundGroup,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    (skillGroup, attrGroup, specializationMods, woundGroup, skill, specialization): DicePoolData => {
      const specializationGroup: DiceGroup | null = specialization
        ? {
            name: specialization,
            size: SRC.Skills.Specialization.Modifier
              + DicePoolFormulas.getSpecializationModTotal({ specializationMods, skill, specialization }),
          }
        : null

      return createDicePool(
        skillPoolId(`skill.active.${skill}`, specialization),
        skillPoolName(skill, specialization),
        [skillGroup, attrGroup, specializationGroup, woundGroup],
      )
    },
  )

  /** The full pool for a Knowledge Skill test: `rating` + Logic, the Specialization bonus, and the Wound Modifier. */
  export const selectKnowledgeSkillPool = createMemoizedSelector(
    injectOption(selectAttrGroup, { attr: AttributeKey.logic }),
    selectWoundGroup,
    SelectorOptions.knowledge,
    SelectorOptions.rating,
    SelectorOptions.specialization,
    (attrGroup, woundGroup, knowledge, rating, specialization): DicePoolData =>
      createDicePool(
        skillPoolId(`skill.knowledge.${knowledge}`, specialization),
        skillPoolName(knowledge, specialization),
        [
          { name: knowledge, size: rating },
          attrGroup,
          specialization ? { name: specialization, size: SRC.Skills.Specialization.Modifier } : null,
          woundGroup,
        ],
      ),
  )

  /**
   * The full pool for a Language Skill test: `rating` + Intuition, the lingo bonus, and the Wound
   * Modifier. A native Language contributes no rating dice — it always succeeds automatically.
   */
  export const selectLanguageSkillPool = createMemoizedSelector(
    injectOption(selectAttrGroup, { attr: AttributeKey.intuition }),
    selectWoundGroup,
    SelectorOptions.language,
    SelectorOptions.isNative,
    SelectorOptions.rating,
    SelectorOptions.lingo,
    (attrGroup, woundGroup, language, isNative, rating, lingo): DicePoolData =>
      createDicePool(
        skillPoolId(`skill.language.${language}`, lingo),
        skillPoolName(language, lingo),
        [
          { name: language, size: isNative ? 0 : rating },
          attrGroup,
          lingo ? { name: lingo, size: SRC.Skills.Specialization.Modifier } : null,
          woundGroup,
        ],
      ),
  )

  /**
   * The {@link DiceGroup}s an Attribute contributes to a test: just its base rating.
   */
  export const selectAttrTest = createMemoizedSelector(
    selectAttrValue,
    SelectorOptions.attr,
    (attrValue, attr): DiceGroup[] => [
      { name: AttributeLabels[attr], size: attrValue, type: "attribute" },
    ],
  )

  /**
   * The {@link DiceGroup}s a Skill contributes to a test: its base rating (or a Defaulting penalty
   * when untrained and defaultable), plus a combined entry for any active `skillMod` GameEffects
   * and the flat Specialization bonus.
   */
  export const selectSkillTest = createMemoizedSelector(
    SkillsSelectors.selectActiveSkills,
    SkillsSelectors.selectSkillGroups,
    selectSkillModTotal,
    SelectorOptions.skill,
    SelectorOptions.isSpecialized,
    SelectorOptions.excludeDefaulting,
    (activeSkills, skillGroups, modTotal, skill, isSpecialized, excludeDefaulting): DiceGroup[] => {
      const skillInfo = skillList[skill]
      const skillRating = activeSkills.find((s) => s.name === skill)?.rating ?? 0
      const groupRating = skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
      const base = Math.max(skillRating, groupRating, 0)

      const groups: DiceGroup[] = []
      if (base === 0 && !excludeDefaulting && (skillInfo.defaultable ?? true)) {
        groups.push({ name: `${skill} - Defaulting`, size: SRC.Skills.Defaulting.Modifier, type: "defaulting" })
      } else {
        groups.push({ name: skill, size: base, type: "skill" })
      }

      const totalMod = modTotal + (isSpecialized ? SRC.Skills.Specialization.Modifier : 0)
      if (totalMod !== 0) {
        groups.push({ name: `${skill} Mod`, size: totalMod, type: "bonus" })
      }

      return groups
    },
  )

  /**
   * Assembles the full dice pool for a Standard Test rolling `attr` + `skill`: Base Attribute,
   * Base Skill, and Skill mod(s), each queried live against active GameEffects.
   */
  export const selectStandardTest = createMemoizedSelector(
    selectAttrTest,
    selectSkillTest,
    SelectorOptions.attr,
    SelectorOptions.skill,
    (attrGroups, skillGroups, attr, skill): DicePoolData =>
      createDicePool(
        `standardTest.${attr}.${skill}`,
        `${AttributeLabels[attr]} + ${skill}`,
        [...attrGroups, ...skillGroups],
      ),
  )
}
