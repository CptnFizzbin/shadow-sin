import { describe, expect, it } from "vitest"

import { DamageTrackKey } from "#/data/entities/damageTrackKey.ts"
import type { AgentData } from "#/data/items/agentData.ts"
import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import { setDamage } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { makeAgent } from "#testUtils/fixtures/makeAgent.ts"

describe.concurrent("itemsRootReducer setDamage", () => {
  it("makes an Item's damage visible through the item selectors", () => {
    // Arrange
    const agent = makeAgent()
    const store = createRunnerStateStore({
      mode: "viewer",
      runner: runnerDataFactory({ items: { [agent.id]: agent } }),
    })

    // Act
    store.dispatch(setDamage({ itemId: agent.id, track: DamageTrackKey.matrix, value: 3 }))

    // Assert
    const storedAgent = ItemSelectors.selectById(store.getState(), { itemId: agent.id }) as AgentData
    expect(storedAgent.damage.matrix).toBe(3)
  })

  it("clamps a negative value to 0", () => {
    // Arrange
    const agent = makeAgent({ damage: { matrix: 2 } })
    const store = createRunnerStateStore({
      mode: "viewer",
      runner: runnerDataFactory({ items: { [agent.id]: agent } }),
    })

    // Act
    store.dispatch(setDamage({ itemId: agent.id, track: DamageTrackKey.matrix, value: -1 }))

    // Assert
    const storedAgent = ItemSelectors.selectById(store.getState(), { itemId: agent.id }) as AgentData
    expect(storedAgent.damage.matrix).toBe(0)
  })
})
