import type { AttributeCatalog } from "#data/attributes/attributeCatalog.ts"
import type { SpiritPoolFormula } from "#data/magic/critterPowerData.ts"
import { attrValue } from "#rules/attributes/attributeFormulas.ts"

/**
 * Returns how many dice a spirit rolls for a critter power.
 *
 * @param formula - the power's spirit pool formula
 * @param force - the spirit's Force
 * @param attrs - the spirit's attribute values
 * @returns the size of the spirit's dice pool for the power
 */
export function computeSpiritPowerPool(
  formula: SpiritPoolFormula,
  force: number,
  attrs: AttributeCatalog,
): number {
  switch (formula.type) {
    case "force":
      return force
    case "force_plus":
      return force + attrValue(attrs, formula.attribute)
    default:
      return force
  }
}
