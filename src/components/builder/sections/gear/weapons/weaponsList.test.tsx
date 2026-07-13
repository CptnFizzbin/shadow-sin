import { createStore } from "@tanstack/store"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import type { FirearmData } from "#/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { WeaponsList } from "./weaponsList.tsx"

const pistol: FirearmData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  firearmType: FirearmTypeKey.heavyPistol,
  dmg: "5P",
  ap: -1,
  skill: SkillKey.pistols,
  attribute: AttributeKey.agility,
  equipped: false,
  recoil: 0,
  firemodes: ["SA"],
  attachmentPoints: [FirearmAttachmentPoint.Top],
  ammo: {
    size: 15,
    remaining: 15,
    type: "clip",
  },
}

describe("WeaponsList", () => {
  it("shows weapons from the store", () => {
    // Arrange / Act
    renderInBuilder(<WeaponsList />, {
      runnerStore: createStore(runnerDataFactory((runner) => ({ ...runner, gear: { [pistol.id]: pistol } }))),
    })

    // Assert
    expect(screen.getByText("Ares Predator")).toBeDefined()
  })

  it("adding a weapon dispatches addItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<WeaponsList />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add weapon/i }))
    fillNameAndClickSave("Colt Manhunter")

    // Assert: the UI re-rendered off the updated store.
    expect(await screen.findByText("Colt Manhunter")).toBeDefined()
  })

  it("removing a weapon dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<WeaponsList />, {
      runnerStore: createStore(runnerDataFactory((runner) => ({ ...runner, gear: { [pistol.id]: pistol } }))),
    })
    expect(screen.getByText("Ares Predator")).toBeDefined()

    // Act: the remove icon button has no accessible name.
    const removeButton = screen.getAllByRole("button").find((button) => button.textContent === "")
    removeButton!.click()

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Ares Predator")).toBeNull())
  })
})
