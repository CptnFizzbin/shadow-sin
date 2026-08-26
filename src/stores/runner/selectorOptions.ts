import { selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ItemType } from "#/system/itemType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

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
  attributeKey: selectorOption<{ key: AttributeKey }>("key"),
  damageSystem: selectorOption<{ system?: number }>("system"),
  damageTrack: selectorOption<{ track: DamageTrackKey }>("track"),
  gameEffectType: selectorOption<{ gameEffectType: GameEffectType }>("gameEffectType"),
  houseRuleKey: selectorOption<{ key: string }>("key"),
  itemId: selectorOption<{ itemId: UUID }>("itemId"),
  itemType: selectorOption<{ itemType: ItemType }>("itemType"),
  licenseId: selectorOption<{ licenseId: UUID }>("licenseId"),
  skillName: selectorOption<{ skillName: SkillKey }>("skillName"),
}
