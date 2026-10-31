import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

import { MagicPoolSelectors } from "./magicPools.selector.ts"

describe.concurrent("MagicPoolSelectors.selectDrainResistanceTest", () => {
  it("leaves out the Wound Modifier, since Drain Resistance is a Resistance Test", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const pool = MagicPoolSelectors.selectDrainResistanceTest(
      { runner, entity: runner, items: getItemCatalog(runner) },
      { attr: AttributeKey.logic },
    )

    // Assert
    expect(pool.groups).not.toContainEqual({ name: "Wound", size: -1, type: "penalty" })
  })
})
