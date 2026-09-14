import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/runnerDataStore.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FirearmData } from "#/system/model/items/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/system/model/items/weaponData.ts"
import { FirearmTypeKey } from "#/system/model/items/weapons/firearms/firearmTypeKey.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { WeaponsSectionContent } from "./weaponsSectionContent.tsx"

const pistol: FirearmData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
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

describe("WeaponsSectionContent", () => {
  it("shows weapons from the store", () => {
    // Arrange / Act
    renderInBuilder(<WeaponsSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [pistol.id]: pistol } })),
    })

    // Assert
    expect(screen.getByText("Ares Predator")).toBeDefined()
  })

  it("tapping a weapon opens the edit dialog directly — the Builder has no details page", () => {
    // Arrange
    renderInBuilder(<WeaponsSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [pistol.id]: pistol } })),
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /ares predator/i }))

    // Assert: the weapon form dialog opened, pre-filled for editing.
    expect(screen.getByRole("dialog", { name: /edit weapon/i })).toBeDefined()
  })

  it("removing a weapon dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<WeaponsSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [pistol.id]: pistol } })),
    })
    expect(screen.getByText("Ares Predator")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Ares Predator")).toBeNull())
  })
})
