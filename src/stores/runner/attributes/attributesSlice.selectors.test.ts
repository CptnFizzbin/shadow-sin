import { describe, expect, it } from "vitest"

import { AttributeKey, AttrKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { AccessLevel } from "#/system/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import { NodeType } from "#/system/matrix/nodeType.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { AttrSelectors } from "./attributesSlice.selectors.ts"

/** `AttrSelectors`' `TState` — `{ entity: EntityBase & EntityWithAttrs }` — is what
 *  `useRunnerSelector` assembles from a `RunnerData` alone (see `RunnerSelectorState` in
 *  `runnerStore.selectors.ts`); a `RunnerData` structurally satisfies both traits, so tests
 *  assemble it the same way. */
const stateFor = (runner: RunnerData) => ({
  runner: runner,
  entity: runner,
})

/** @deprecated - use {@link stateFor} instead */
const runnerStateFor = stateFor

describe("AttrSelectors.selectAll", () => {
  it("returns the entity's attributes record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(AttrSelectors.selectAll(stateFor(runner))).toEqual(expect.objectContaining(runner.attributes))
  })
})

describe("AttrSelectors.selectBase", () => {
  it("returns the stored value for the given key", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 6
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectBase(stateFor(runner), { key: AttributeKey.agility })).toBe(6)
  })

  it("returns 0 when the key is unset", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        delete s.attributes[AttributeKey.resonance]
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectBase(stateFor(runner), { key: AttributeKey.resonance })).toBe(0)
  })
})

describe("AttrSelectors.selectValue", () => {
  it("matches selectBase (no derived modifiers applied yet)", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.logic] = 3
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.logic })).toBe(3)
  })
})

describe("AttrSelectors.forAttr", () => {
  it("pins selectBase to the given attribute, needing no options", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.strength] = 5
      },
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.strength).selectBase(stateFor(runner))).toBe(5)
  })

  it("pins selectValue to the given attribute, needing no options", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.charisma] = 7
      },
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.charisma).selectValue(stateFor(runner))).toBe(7)
  })

  it("doesn't leak values between attributes", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.body] = 2
        s.attributes[AttributeKey.reaction] = 9
      },
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.body).selectBase(stateFor(runner))).toBe(2)
    expect(AttrSelectors.forAttr(AttributeKey.reaction).selectBase(stateFor(runner))).toBe(9)
  })
})

describe("AttrSelectors.selectBounds", () => {
  it("uses the runner's metatype bounds for a physical attribute", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.metatype = MetatypeType.Human
      },
    })

    // Act
    const attrs = AttrSelectors.selectBounds(runnerStateFor(runner))

    // Assert
    expect(attrs[AttributeKey.body]).toEqual({ attr: AttrKey.body, min: 1, max: 6, augMax: 9 })
  })

  it("uses the runner's awakening bounds for magic/resonance", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.awakening = AwakeningType.Mundane
      },
    })

    // Act
    const attrs = AttrSelectors.selectBounds(runnerStateFor(runner))

    // Act / Assert
    expect(attrs[AttributeKey.magic]).toEqual({ attr: AttrKey.magic, min: 0, max: 0 })
  })
})

describe("AttrSelectors.selectAllInfo", () => {
  it("pairs each attribute's bounds with its base and current value", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.body] = 4
      },
    })

    // Act
    const info = AttrSelectors.selectAllInfo(runnerStateFor(runner))

    // Assert
    expect(info[AttributeKey.body]).toEqual({
      attr: AttrKey.body,
      min: 1,
      max: 6,
      augMax: 9,
      base: 4,
      baseValue: 4,
      current: 4,
      value: 4,
    })
  })
})

describe("AttrSelectors.selectInfo", () => {
  it("returns the same info as selectAllInfo for the given key", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.willpower] = 5
      },
    })

    // Act / Assert
    expect(AttrSelectors.selectInfo(runnerStateFor(runner), { key: AttributeKey.willpower }))
      .toEqual(AttrSelectors.selectAllInfo(runnerStateFor(runner))[AttributeKey.willpower])
  })
})

/** RAW's own worked example (Unwired p.167): Corvus has CHA 2, INT 5, LOG 4, WIL 3 — Rating 4,
 *  System 5, Firewall 3. */
const corvusMentalAttrs = { charisma: 2, intuition: 5, logic: 4, willpower: 3 }

const aiRunnerFor = (
  mentalAttrs: { charisma: number, intuition: number, logic: number, willpower: number },
  activeNode?: KnownNode,
): RunnerData =>
  runnerDataFactory({
    afterBuild: (s) => {
      s.biology.metatype = MetatypeType.AI
      s.biology.awakening = AwakeningType.None

      s.attributes[AttributeKey.charisma] = mentalAttrs.charisma
      s.attributes[AttributeKey.intuition] = mentalAttrs.intuition
      s.attributes[AttributeKey.logic] = mentalAttrs.logic
      s.attributes[AttributeKey.willpower] = mentalAttrs.willpower

      if (activeNode) {
        s.gameState.matrix.knownNodes = [activeNode]
        s.gameState.matrix.activeNodeId = activeNode.id
      }
    },
  })

describe("AttrSelectors.selectAllInfo — AI metatype", () => {
  it("overrides Edge's max/augMax to the computed Rating", () => {
    // Arrange
    const runner = aiRunnerFor(corvusMentalAttrs)

    // Act
    const info = AttrSelectors.selectAllInfo(stateFor(runner))

    // Assert
    expect(info[AttributeKey.edge]?.max).toBe(4)
    expect(info[AttributeKey.edge]?.augMax).toBe(4)
  })
})

const knownNodeFixture = (matrix: Partial<Record<AttributeKey, number>>): KnownNode => ({
  kind: EntityKind.matrixNode,
  id: "node-1",
  name: "Test Node",
  nodeType: NodeType.general,
  accessLevel: AccessLevel.user,
  matrix,
})

describe("AttrSelectors.selectValue — AI metatype", () => {
  it("computes System and Firewall from the AI's own Mental attributes", () => {
    // Arrange: RAW's own worked example (Unwired p.167) — CHA 2, INT 5, LOG 4, WIL 3 gives
    // System = ceil(avg(INT, LOG)) = 5, Firewall = ceil(avg(WIL, CHA)) = 3.
    const runner = aiRunnerFor(corvusMentalAttrs)

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.system })).toBe(5)
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.firewall })).toBe(3)
  })

  it("resolves Response/Signal from the Runner's Active Node", () => {
    // Arrange
    const node = knownNodeFixture({ [AttributeKey.response]: 4, [AttributeKey.signal]: 6 })
    const runner = aiRunnerFor(corvusMentalAttrs, node)

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.response })).toBe(4)
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.signal })).toBe(6)
  })

  it("falls back to 0 for Response/Signal with no Active Node", () => {
    // Arrange
    const runner = aiRunnerFor(corvusMentalAttrs)

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.response })).toBe(0)
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.signal })).toBe(0)
  })
})
