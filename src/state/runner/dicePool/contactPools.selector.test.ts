import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

import { ContactPoolSelectors } from "./contactPools.selector.ts"

describe.concurrent("ContactPoolSelectors.selectLegworkGmTest", () => {
  it("leaves out the Runner's Wound Modifier, since the Contact rolls it", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })

    // Act
    const pool = ContactPoolSelectors.selectLegworkGmTest(
      { runner, entity: runner, items: getItemCatalog(runner) },
      { connection: 4 },
    )

    // Assert
    expect(pool.groups).toEqual([
      { name: "Connection", size: 4 },
      { name: "Connection", size: 4 },
    ])
  })
})
