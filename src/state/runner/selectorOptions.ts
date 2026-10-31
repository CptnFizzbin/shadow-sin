import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { ArmorRatingType } from "#/system/model/items/armorData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ItemType } from "#/system/model/items/itemType.ts"
import type { SpiritType } from "#/system/model/magic/spiritData.ts"
import type { ReputationStatType } from "#/system/model/reputation/reputationLedgerEntry.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

/**
 * Every `TOptions` accessor a namespaced `runner/**` selector needs (see
 * `docs/adr/0014-selector-input-decomposition.md`), gathered in one place. A domain's selectors
 * (`AttrSelectors.selectBase`, `ItemSelectors.selectById`, ...) reference an entry here directly
 * as a `reselect` input selector, rather than each domain calling `selectorOption` locally to
 * build its own — this is what keeps two unrelated options from quietly sharing a name:
 * `attributeKey` (an `AttributeKey`) and `houseRuleKey` (a bare `string`) both underlie an option
 * field literally called `key`, and would look identical at a glance as two separate local
 * declarations in two files. Naming them distinctly here, side by side, makes that impossible.
 *
 * A `SelectorOptions.*` entry's own name doesn't have to match the `TOptions` field it reads
 * (`selectorOption`'s first type argument) — `attributeKey` and `houseRuleKey` both read a field
 * called `key`, just on different `TOptions` shapes.
 */
export const SelectorOptions = {
  armor: selectorOption<{ armor: ArmorRatingType }>("armor"),
  attr: selectorOption<{ attr: AttributeKey }>("attr"),
  connection: selectorOption<{ connection: number }>("connection"),
  damageResistanceType: selectorOption<{ damageType: "P" | "S" }>("damageType"),
  damageSystem: selectorOption<{ system?: number }>("system"),
  damageTrack: selectorOption<{ track: DamageTrackKey }>("track"),
  doubleSkill: selectorOption<{ doubleSkill?: boolean }>("doubleSkill"),
  excludeDefaulting: selectorOption<{ excludeDefaulting?: boolean }>("excludeDefaulting"),
  extraGroups: selectorOption<{ extraGroups: DiceGroup[] }>("extraGroups"),
  gameEffectType: selectorOption<{ gameEffectType: GameEffectType }>("gameEffectType"),
  halveArmor: selectorOption<{ halveArmor?: boolean }>("halveArmor"),
  includeEncumbrance: selectorOption<{ includeEncumbrance: boolean }>("includeEncumbrance"),
  isNative: selectorOption<{ isNative: boolean }>("isNative"),
  isSpecialized: selectorOption<{ isSpecialized?: boolean }>("isSpecialized"),
  itemId: selectorOption<{ itemId: UUID }>("itemId"),
  itemType: selectorOption<{ itemType: ItemType }>("itemType"),
  knowledge: selectorOption<{ knowledge: string }>("knowledge"),
  language: selectorOption<{ language: string }>("language"),
  licenseId: selectorOption<{ licenseId: UUID }>("licenseId"),
  lingo: selectorOption<{ lingo?: string }>("lingo"),
  loyalty: selectorOption<{ loyalty: number }>("loyalty"),
  rating: selectorOption<{ rating: number }>("rating"),
  repType: selectorOption<{ repType: ReputationStatType }>("repType"),
  skill: selectorOption<{ skill: SkillKey }>("skill"),
  specialization: selectorOption<{ specialization?: string }>("specialization"),
  spiritType: selectorOption<{ spiritType: SpiritType }>("spiritType"),

  /** @deprecated - use {@link SelectorOptions.skill} instead */
  skillName: selectorOption<{ skillName: SkillKey }>("skillName"),

  key: {
    /** @deprecated - use {@link SelectorOptions.attr} instead */
    attr: selectorOption<{ key: AttributeKey }>("key"),
    skill: selectorOption<{ key: SkillKey }>("key"),
    houseRule: selectorOption<{ key: string }>("key"),
  },

  filter: {
    item: selectorOption<{ filter: (item: ItemData) => boolean }>("filter"),
  },

  /** @deprecated - use {@link SelectorOptions.attr} instead */
  attributeKey: selectorOption<{ key: AttributeKey }>("key"),

  /** @deprecated - use {@link SelectorOptions.key.skill} instead */
  skillKey: selectorOption<{ key: SkillKey }>("key"),

  /** @deprecated - use {@link SelectorOptions.key.houseRule} instead */
  houseRuleKey: selectorOption<{ key: string }>("key"),
}
