import { AttributeKey } from "#/system/attributeKey.ts"
import type { MatrixNodeData } from "#/system/matrix/matrixNodeData.ts"
import { MetatypeType } from "#/system/metatypeData.ts"

import type { AttributeCatalog } from "./attributeCatalog.ts"

function getRating(attrs: {
  charisma: number
  intuition: number
  logic: number
  willpower: number
}): number {
  return Math.ceil((attrs.charisma + attrs.intuition + attrs.logic + attrs.willpower) / 4)
}

export const AiAttrFormulas = {
  /** Rating = ceil(avg(Charisma, Intuition, Logic, Willpower)). Also caps Edge's natural max. */
  getRating,

  getResponse: (inputs: { activeNode: MatrixNodeData }): number => {
    const node = inputs.activeNode
    return node.matrix.response ?? node.rating ?? 0
  },

  getSignal: (inputs: { activeNode: MatrixNodeData }): number => {
    const node = inputs.activeNode
    return node.matrix.signal ?? node.rating ?? 0
  },

  /** System = ceil(avg(Intuition, Logic)). */
  getSystem: (inputs: { intuition: number, logic: number }): number => {
    return Math.ceil((inputs.intuition + inputs.logic) / 2)
  },

  /** Firewall = ceil(avg(Willpower, Charisma)). */
  getFirewall: (inputs: { willpower: number, charisma: number }): number => {
    return Math.ceil((inputs.willpower + inputs.charisma) / 2)
  },

  /**
   * Convenience wrapper around {@link getRating} for a caller that already holds the whole
   * attribute catalog (e.g. overriding Edge's natural max for AI) rather than four separate
   * numbers — reads Charisma/Intuition/Logic/Willpower out of it, defaulting any unset key to 0.
   */
  getRatingFromAttributes: (attributes: AttributeCatalog): number =>
    getRating({
      charisma: attributes[AttributeKey.charisma] ?? 0,
      intuition: attributes[AttributeKey.intuition] ?? 0,
      logic: attributes[AttributeKey.logic] ?? 0,
      willpower: attributes[AttributeKey.willpower] ?? 0,
    }),

  /**
   * The one place that decides "does this attribute's natural max come from the computed Rating
   * instead of the metatype table" — currently just Edge, for AI (SR4A/Unwired). Returns
   * `undefined` for every other attribute/metatype combination, so a caller falls back to its own
   * already-computed bounds unchanged. Every consumer of Edge's bounds (selectAllInfo,
   * selectActive, biologyAttributes.tsx, getAttributeCap) goes through this rather than
   * re-implementing the `attr === edge && metatype === AI` check itself, so a future rule change
   * (a different formula, or extending the dynamic-cap treatment to another attribute) is a single
   * edit here instead of four synchronized ones.
   */
  getEdgeMaxOverride: (
    attr: AttributeKey,
    metatypeName: MetatypeType,
    attributes: AttributeCatalog,
  ): number | undefined =>
    attr === AttributeKey.edge && metatypeName === MetatypeType.AI
      ? AiAttrFormulas.getRatingFromAttributes(attributes)
      : undefined,
}
