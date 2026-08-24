import { selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { ItemType } from "#/system/itemType.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

/**
 * Every `TOptions` accessor used by a namespaced `runner/**` selector's `Options.*` (see
 * `docs/adr/0014-selector-input-decomposition.md`), gathered in one place. Each domain's own
 * `Options` object (`AttrSelectors.Options`, `ItemSelectors.Options`, ...) re-exports the entries
 * it needs from here rather than calling `selectorOption` locally — this is what keeps two
 * unrelated options from quietly sharing a name: `attributeKey` (an `AttributeKey`) and
 * `houseRuleKey` (a bare `string`) both underlie an option field literally called `key`, and would
 * look identical at a glance as two separate local `Options.key` declarations in two files. Naming
 * them distinctly here, side by side, makes that impossible.
 *
 * A `SelectorOptions.*` entry's own name doesn't have to match the `TOptions` field it reads
 * (`selectorOption`'s first type argument) — `attributeKey` and `houseRuleKey` both read a field
 * called `key`, just on different `TOptions` shapes.
 */
export const SelectorOptions = {
  attributeKey: selectorOption<{ key: AttributeKey }>("key"),
  damageSystem: selectorOption<{ system?: number }>("system"),
  damageTrack: selectorOption<{ track: DamageTrackKey }>("track"),
  houseRuleKey: selectorOption<{ key: string }>("key"),
  itemId: selectorOption<{ itemId: UUID }>("itemId"),
  itemType: selectorOption<{ itemType: ItemType }>("itemType"),
  licenseId: selectorOption<{ licenseId: UUID }>("licenseId"),
  skillName: selectorOption<{ skillName: SkillKey }>("skillName"),
}
