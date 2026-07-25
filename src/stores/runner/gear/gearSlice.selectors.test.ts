import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { selectAvailable, selectEquipped, selectGear, selectStashed } from "./gearSlice.selectors.ts"

const item = { id: NullUuid, name: "Test Item", itemType: ItemType.other }

describe("selectGear", () => {
  it("returns the gear record", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectGear(sheet)).toBe(sheet.gear)
  })
})

describe("selectEquipped", () => {
  it("returns only items with equipped === true", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = {
        [item.id]: { ...item, equipped: true },
      }
      return s
    })

    expect(selectEquipped(sheet)).toEqual([{ ...item, equipped: true }])
  })

  it("excludes items with equipped false or absent", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectEquipped(sheet)).toEqual([])
  })
})

describe("selectStashed", () => {
  it("always returns an empty array (stubbed pending #388)", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectStashed(sheet)).toEqual([])
  })
})

describe("selectAvailable", () => {
  it("always returns every gear item (stubbed pending #388)", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectAvailable(sheet)).toEqual([item])
  })
})
