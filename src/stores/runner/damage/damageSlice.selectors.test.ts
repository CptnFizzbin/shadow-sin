import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { DamageSelectors, selectPhysicalTrack, selectStunTrack } from "./damageSlice.selectors.ts"

/** `DamageSelectors`' `TState` — `{ runner, entity: EntityWithDamage & EntityWithQualities }` — is
 *  what `useRunnerSelector` assembles from a `RunnerData` alone (see `mapToLegacySelector.ts`); a
 *  `RunnerData` structurally satisfies both traits, so tests assemble it the same way. */
const stateFor = (runner: RunnerData) => ({ runner, entity: runner })

describe.concurrent("selectPhysicalTrack / selectStunTrack", () => {
  it("returns default wound interval of 3 with no pain tolerance effects", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(3)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("returns wound interval of 2 for physical with Low Pain Tolerance (-1)", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(2)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("does not change the wound interval with High Pain Tolerance", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.stun, value: 1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(3)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("does not change the wound interval for either track when High Pain Tolerance targets 'all'", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: "all", value: 1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(3)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("clamps wound interval to a minimum of 1 for extreme negative pain tolerance", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Extreme Pain Intolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -10 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(1)
  })

  it("computes physical max from body attribute", () => {
    // Arrange — 8 + ceil(4/2) = 10
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.body] = 4
    } })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).max).toBe(10)
  })

  it("computes stun max from willpower attribute", () => {
    // Arrange — 8 + ceil(6/2) = 11
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.willpower] = 6
    } })

    // Act / Assert
    expect(selectStunTrack(sheet).max).toBe(11)
  })

  it("reflects current damage values", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 5
      s.damage.stun = 2
    } })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).current).toBe(5)
    expect(selectStunTrack(sheet).current).toBe(2)
  })
})

describe("DamageSelectors.selectDamage", () => {
  it("reads the current value off the given track", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 5
      s.damage.stun = 2
      s.damage.matrix = 1
    } })

    // Act / Assert
    expect(DamageSelectors.selectDamage(stateFor(runner), { track: DamageTrackKey.physical })).toBe(5)
    expect(DamageSelectors.selectDamage(stateFor(runner), { track: DamageTrackKey.stun })).toBe(2)
    expect(DamageSelectors.selectDamage(stateFor(runner), { track: DamageTrackKey.matrix })).toBe(1)
  })
})

describe("DamageSelectors.selectWoundInterval", () => {
  it("defaults to 3 with no pain tolerance effects", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(DamageSelectors.selectWoundInterval(stateFor(runner), { track: DamageTrackKey.physical })).toBe(3)
  })

  it("shrinks for the targeted track with Low Pain Tolerance", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(DamageSelectors.selectWoundInterval(stateFor(runner), { track: DamageTrackKey.physical })).toBe(2)
    expect(DamageSelectors.selectWoundInterval(stateFor(runner), { track: DamageTrackKey.stun })).toBe(3)
  })

  it("clamps to a minimum of 1 for extreme negative pain tolerance", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Extreme Pain Intolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -10 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(DamageSelectors.selectWoundInterval(stateFor(runner), { track: DamageTrackKey.physical })).toBe(1)
  })

  it("counts an equipped gear item's Low Pain Tolerance effect", () => {
    // Arrange
    const runner = runnerDataFactory({
      items: {
        [NullUuid]: {
          kind: EntityKind.item, items: { parentId: null, childIds: [] },
          id: NullUuid,
          name: "Trauma Damper",
          itemType: ItemType.other,
          equipped: true,
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      },
    })

    // Act / Assert
    expect(DamageSelectors.selectWoundInterval(stateFor(runner), { track: DamageTrackKey.physical })).toBe(2)
  })

  it("ignores a matching gear effect on an item that isn't equipped", () => {
    // Arrange
    const runner = runnerDataFactory({
      items: {
        [NullUuid]: {
          kind: EntityKind.item, items: { parentId: null, childIds: [] },
          id: NullUuid,
          name: "Trauma Damper",
          itemType: ItemType.other,
          equipped: false,
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      },
    })

    // Act / Assert
    expect(DamageSelectors.selectWoundInterval(stateFor(runner), { track: DamageTrackKey.physical })).toBe(3)
  })
})

describe("DamageSelectors.selectWoundIntervalOffset", () => {
  it("defaults to 0 with no pain tolerance effects", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(DamageSelectors.selectWoundIntervalOffset(stateFor(runner), { track: DamageTrackKey.physical })).toBe(0)
  })

  it("grows for the targeted track with High Pain Tolerance", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.stun, value: 1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(DamageSelectors.selectWoundIntervalOffset(stateFor(runner), { track: DamageTrackKey.stun })).toBe(1)
    expect(DamageSelectors.selectWoundIntervalOffset(stateFor(runner), { track: DamageTrackKey.physical })).toBe(0)
  })

  it("applies to every track when the effect targets 'all'", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: "all", value: 1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(DamageSelectors.selectWoundIntervalOffset(stateFor(runner), { track: DamageTrackKey.physical })).toBe(1)
    expect(DamageSelectors.selectWoundIntervalOffset(stateFor(runner), { track: DamageTrackKey.stun })).toBe(1)
  })
})

describe("DamageSelectors.selectWoundModForTrack", () => {
  it("is 0 when damage hasn't exceeded the wound interval", () => {
    // Arrange — interval 3, damage 2 → floor(2/3) = 0
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 2
    } })

    // Act / Assert
    expect(
      DamageSelectors.selectWoundModForTrack(stateFor(runner), { track: DamageTrackKey.physical }),
    ).toBe(0)
  })

  it("counts one wound per full interval of damage taken", () => {
    // Arrange — interval 3, damage 7 → floor(7/3) = 2
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 7
    } })

    // Act / Assert
    expect(
      DamageSelectors.selectWoundModForTrack(stateFor(runner), { track: DamageTrackKey.physical }),
    ).toBe(2)
  })

  it("subtracts the wound interval offset before dividing", () => {
    // Arrange — interval 3, offset 1 (High Pain Tolerance), damage 4 → floor((4-1)/3) = 1
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 4
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(
      DamageSelectors.selectWoundModForTrack(stateFor(runner), { track: DamageTrackKey.physical }),
    ).toBe(1)
  })

  it("never goes negative when the offset exceeds current damage", () => {
    // Arrange — offset 1, damage 0 → floor(max(0, 0-1)/3) = 0
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 },
          ],
        },
      ]
    } })

    // Act / Assert
    expect(
      DamageSelectors.selectWoundModForTrack(stateFor(runner), { track: DamageTrackKey.physical }),
    ).toBe(0)
  })
})

describe("DamageSelectors.selectWoundMod", () => {
  it("sums the physical and stun wound mods", () => {
    // Arrange — physical: floor(7/3) = 2, stun: floor(4/3) = 1
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 7
      s.damage.stun = 4
    } })

    // Act / Assert
    expect(DamageSelectors.selectWoundMod(stateFor(runner))).toBe(3)
  })

  it("ignores matrix damage", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.matrix = 9
    } })

    // Act / Assert
    expect(DamageSelectors.selectWoundMod(stateFor(runner))).toBe(0)
  })
})

describe("DamageSelectors.track", () => {
  it("computes physical max from the body attribute", () => {
    // Arrange — 8 + ceil(4/2) = 10
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.body] = 4
    } })

    // Act / Assert
    expect(DamageSelectors.track.physical(stateFor(runner))).toEqual({
      max: 10,
      current: 0,
      woundInterval: 3,
      woundIntervalOffset: 0,
    })
  })

  it("computes stun max from the willpower attribute", () => {
    // Arrange — 8 + ceil(6/2) = 11
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.willpower] = 6
    } })

    // Act / Assert
    expect(DamageSelectors.track.stun(stateFor(runner)).max).toBe(11)
  })

  it("computes matrix max from the given system rating", () => {
    // Arrange — 8 + ceil(5/2) = 11
    const runner = runnerDataFactory()

    // Act / Assert
    expect(DamageSelectors.track.matrix(stateFor(runner), { system: 5 }).max).toBe(11)
  })

  it("defaults matrix system rating to 0 when omitted", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(DamageSelectors.track.matrix(stateFor(runner), { system: undefined }).max).toBe(8)
  })

  it("reflects current damage and wound interval together", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.stun = 3
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.stun, value: -1 },
          ],
        },
      ]
    } })

    // Act
    const result = DamageSelectors.track.stun(stateFor(runner))

    // Assert
    expect(result.current).toBe(3)
    expect(result.woundInterval).toBe(2)
  })
})
