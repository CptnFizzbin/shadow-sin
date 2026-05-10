import { describe, expect, it } from "vitest"

import { Artemis } from "#/character/fixtures/artemis.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import type { GearTreeNode } from "./exportUtils.ts"
import { characterSheetToYaml, gearFromTree, gearToTree, yamlToCharacterSheet } from "./exportUtils.ts"

describe("gearToTree", () => {
  it("returns an empty array when gear is empty", () => {
    // Arrange & Act
    const result = gearToTree({})

    // Assert
    expect(result).toEqual([])
  })

  it("includes a root-level SIN with no children", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Sara McCabe", itemType: ItemType.sin, rating: 6 }),
    )

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Sara McCabe")
    expect(result[0].itemType).toBe(ItemType.sin)
    expect(result[0].children).toBeUndefined()
  })

  it("includes multiple root-level SINs with no children", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Sara McCabe", itemType: ItemType.sin, rating: 6 }),
      createItem<SinData>({ name: "Jadzia Dax", itemType: ItemType.sin, rating: 4 }),
      createItem<SinData>({ name: "Jane Smith", itemType: ItemType.sin, rating: 2 }),
    )

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(3)
    const names = result.map((node) => node.name)
    expect(names).toContain("Sara McCabe")
    expect(names).toContain("Jadzia Dax")
    expect(names).toContain("Jane Smith")
  })

  it("nests licenses under their parent SIN", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Jadzia Dax", itemType: ItemType.sin, rating: 4 }, [
        createItem<LicenseData>({
          name: "Driver License",
          itemType: ItemType.license,
          rating: 4,
        }),
      ]),
    )

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    const sin = result[0]
    expect(sin.name).toBe("Jadzia Dax")
    expect(sin.children).toHaveLength(1)
    expect(sin.children![0].name).toBe("Driver License")
    expect(sin.children![0].itemType).toBe(ItemType.license)
    expect(sin.children![0].children).toBeUndefined()
  })

  it("nests multiple licenses under a single SIN", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Runner SIN", itemType: ItemType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: ItemType.license, rating: 4 }),
        createItem<LicenseData>({ name: "Firearms License", itemType: ItemType.license, rating: 4 }),
        createItem<LicenseData>({ name: "Cyberware License", itemType: ItemType.license, rating: 4 }),
      ]),
    )

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    const sin = result[0]
    expect(sin.children).toHaveLength(3)
    const licenseNames = sin.children!.map((c) => c.name)
    expect(licenseNames).toContain("Driver License")
    expect(licenseNames).toContain("Firearms License")
    expect(licenseNames).toContain("Cyberware License")
  })

  it("includes SINs without licenses alongside SINs with licenses", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Clean SIN", itemType: ItemType.sin, rating: 6 }),
      createItem<SinData>({ name: "Runner SIN", itemType: ItemType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: ItemType.license, rating: 4 }),
      ]),
      createItem<SinData>({ name: "Burner SIN", itemType: ItemType.sin, rating: 2 }),
    )

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(3)

    const cleanSin = result.find((n) => n.name === "Clean SIN")
    expect(cleanSin).toBeDefined()
    expect(cleanSin!.children).toBeUndefined()

    const runnerSin = result.find((n) => n.name === "Runner SIN")
    expect(runnerSin).toBeDefined()
    expect(runnerSin!.children).toHaveLength(1)
    expect(runnerSin!.children![0].name).toBe("Driver License")

    const burnerSin = result.find((n) => n.name === "Burner SIN")
    expect(burnerSin).toBeDefined()
    expect(burnerSin!.children).toBeUndefined()
  })

  it("omits parentId and childIds from every exported node", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Runner SIN", itemType: ItemType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: ItemType.license, rating: 4 }),
      ]),
    )

    // Act
    const result = gearToTree(gear)

    const allNodes: GearTreeNode[] = []
    const collectNodes = (nodes: GearTreeNode[]) => {
      for (const node of nodes) {
        allNodes.push(node)
        if (node.children) collectNodes(node.children)
      }
    }
    collectNodes(result)

    // Assert
    for (const node of allNodes) {
      expect(node).not.toHaveProperty("parentId")
      expect(node).not.toHaveProperty("childIds")
    }
  })

  it("does not include child items at the root level", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Runner SIN", itemType: ItemType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: ItemType.license, rating: 4 }),
      ]),
    )

    // Act
    const result = gearToTree(gear)

    // Assert – only the SIN (1 item) at root, not the license
    expect(result).toHaveLength(1)
    const rootNames = result.map((n) => n.name)
    expect(rootNames).not.toContain("Driver License")
  })

  it("handles a gear map built without createItem (items with no childIds field)", () => {
    // Simulate items that may lack childIds (e.g. loaded from older storage)
    const sinId = crypto.randomUUID()
    const licenseId = crypto.randomUUID()

    const gear: Record<string, ItemData> = {
      [sinId]: { id: sinId, name: "Handcrafted SIN", itemType: ItemType.sin, rating: 4, childIds: [licenseId] },
      [licenseId]: {
        id: licenseId,
        name: "Handcrafted License",
        itemType: ItemType.license,
        rating: 4,
        parentId: sinId,
      },
    }

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Handcrafted SIN")
    expect(result[0].children).toHaveLength(1)
    expect(result[0].children![0].name).toBe("Handcrafted License")
  })
})

describe("gearFromTree", () => {
  it("returns an empty object for an empty array", () => {
    expect(gearFromTree([])).toEqual({})
  })

  it("round-trips a flat list of root items", () => {
    const gear = createItemMap(
      createItem<SinData>({ name: "Sara McCabe", itemType: ItemType.sin, rating: 6 }),
    )
    const tree = gearToTree(gear)
    const restored = gearFromTree(tree)

    const original = Object.values(gear)[0]
    const result = Object.values(restored)[0]

    expect(result.id).toBe(original.id)
    expect(result.name).toBe(original.name)
    expect(result.itemType).toBe(original.itemType)
    expect(result.parentId).toBeUndefined()
  })

  it("round-trips parent/child relationships", () => {
    const gear = createItemMap(
      createItem<SinData>({ name: "Runner SIN", itemType: ItemType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: ItemType.license, rating: 4 }),
      ]),
    )

    const tree = gearToTree(gear)
    const restored = gearFromTree(tree)

    // Flat map should have both items
    expect(Object.keys(restored)).toHaveLength(2)

    const sinEntry = Object.values(restored).find((item) => item.itemType === ItemType.sin)
    const licenseEntry = Object.values(restored).find((item) => item.itemType === ItemType.license)

    expect(sinEntry).toBeDefined()
    expect(licenseEntry).toBeDefined()
    expect(licenseEntry!.parentId).toBe(sinEntry!.id)
    expect(sinEntry!.childIds).toContain(licenseEntry!.id)
  })

  it("restores items without parentId for root nodes", () => {
    const gear = createItemMap(
      createItem<SinData>({ name: "Clean SIN", itemType: ItemType.sin, rating: 6 }),
    )
    const tree = gearToTree(gear)
    const restored = gearFromTree(tree)

    const item = Object.values(restored)[0]
    expect(item.parentId).toBeUndefined()
  })
})

describe("yamlToCharacterSheet / characterSheetToYaml round-trip", () => {
  it("round-trips a simple character sheet", () => {
    const gear = createItemMap(
      createItem<SinData>({ name: "Sara McCabe", itemType: ItemType.sin, rating: 6 }),
    )
    const original = {
      ...Artemis,
      gear,
    }

    const yaml = characterSheetToYaml(original)
    const restored = yamlToCharacterSheet(yaml)

    expect(restored.id).toBe(original.id)
    expect(restored.profile.alias).toBe(original.profile.alias)
    expect(restored.profile.name).toBe(original.profile.name)
    expect(restored.biology.metatype).toBe(original.biology.metatype)
    expect(Object.keys(restored.gear)).toHaveLength(1)
    expect(Object.values(restored.gear)[0].name).toBe("Sara McCabe")
  })

  it("round-trips a character with nested gear (SIN + licenses)", () => {
    const gear = createItemMap(
      createItem<SinData>({ name: "Runner SIN", itemType: ItemType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: ItemType.license, rating: 4 }),
        createItem<LicenseData>({ name: "Firearms License", itemType: ItemType.license, rating: 4 }),
      ]),
    )
    const original = { ...Artemis, gear }

    const yaml = characterSheetToYaml(original)
    const restored = yamlToCharacterSheet(yaml)

    expect(Object.keys(restored.gear)).toHaveLength(3)

    const sinItem = Object.values(restored.gear).find((item) => item.itemType === ItemType.sin)
    const licenseItems = Object.values(restored.gear).filter((item) => item.itemType === ItemType.license)

    expect(sinItem).toBeDefined()
    expect(licenseItems).toHaveLength(2)
    expect(licenseItems.every((lic) => lic.parentId === sinItem!.id)).toBe(true)
    expect(sinItem!.childIds).toHaveLength(2)
  })

  it("round-trips a character with no gear", () => {
    const original = { ...Artemis, gear: {} }

    const yaml = characterSheetToYaml(original)
    const restored = yamlToCharacterSheet(yaml)

    expect(restored.gear).toEqual({})
  })

  it("preserves all scalar fields through a round-trip", () => {
    const yaml = characterSheetToYaml(Artemis)
    const restored = yamlToCharacterSheet(yaml)

    expect(restored.id).toBe(Artemis.id)
    expect(restored.karma).toEqual(Artemis.karma)
    expect(restored.nuyen).toEqual(Artemis.nuyen)
    expect(restored.attributes).toEqual(Artemis.attributes)
    expect(restored.skills).toEqual(Artemis.skills)
    expect(restored.qualities).toEqual(Artemis.qualities)
    expect(restored.contacts).toEqual(Artemis.contacts)
    expect(restored.spells).toEqual(Artemis.spells)
    expect(restored.powers).toEqual(Artemis.powers)
  })

  it("preserves parent/child IDs exactly through a round-trip", () => {
    const [sinItem, ...licenses] = createItem<SinData>(
      { name: "Runner SIN", itemType: ItemType.sin, rating: 4 },
      [createItem<LicenseData>({ name: "Driver License", itemType: ItemType.license, rating: 4 })],
    )
    const gear = createItemMap([sinItem, ...licenses])
    const original = { ...Artemis, gear }

    const yaml = characterSheetToYaml(original)
    const restored = yamlToCharacterSheet(yaml)

    // Retrieve original items by ID
    const originalSin = gear[sinItem.id]
    const originalLicense = licenses[0]

    // Retrieve restored items by the same IDs
    const restoredSin = restored.gear[sinItem.id]
    const restoredLicense = restored.gear[originalLicense.id]

    expect(restoredSin).toBeDefined()
    expect(restoredLicense).toBeDefined()
    expect(restoredSin.childIds).toEqual(originalSin.childIds)
    expect(restoredLicense.parentId).toBe(originalLicense.parentId)
  })
})
