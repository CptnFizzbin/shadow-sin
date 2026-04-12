import { describe, expect, it } from "vitest"

import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"
import { createItem, createItemMap } from "#/lib/system/itemData.ts"
import type { GearTreeNode } from "./exportUtils.ts"
import { gearToTree } from "./exportUtils.ts"

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
      createItem<SinData>({ name: "Sara McCabe", itemType: GearType.sin, rating: 6 }),
    )

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Sara McCabe")
    expect(result[0].itemType).toBe(GearType.sin)
    expect(result[0].children).toBeUndefined()
  })

  it("includes multiple root-level SINs with no children", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Sara McCabe", itemType: GearType.sin, rating: 6 }),
      createItem<SinData>({ name: "Jadzia Dax", itemType: GearType.sin, rating: 4 }),
      createItem<SinData>({ name: "Jane Smith", itemType: GearType.sin, rating: 2 }),
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
      createItem<SinData>({ name: "Jadzia Dax", itemType: GearType.sin, rating: 4 }, [
        createItem<LicenseData>({
          name: "Driver License",
          itemType: GearType.license,
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
    expect(sin.children![0].itemType).toBe(GearType.license)
    expect(sin.children![0].children).toBeUndefined()
  })

  it("nests multiple licenses under a single SIN", () => {
    // Arrange
    const gear = createItemMap(
      createItem<SinData>({ name: "Runner SIN", itemType: GearType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: GearType.license, rating: 4 }),
        createItem<LicenseData>({ name: "Firearms License", itemType: GearType.license, rating: 4 }),
        createItem<LicenseData>({ name: "Cyberware License", itemType: GearType.license, rating: 4 }),
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
      createItem<SinData>({ name: "Clean SIN", itemType: GearType.sin, rating: 6 }),
      createItem<SinData>({ name: "Runner SIN", itemType: GearType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: GearType.license, rating: 4 }),
      ]),
      createItem<SinData>({ name: "Burner SIN", itemType: GearType.sin, rating: 2 }),
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
      createItem<SinData>({ name: "Runner SIN", itemType: GearType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: GearType.license, rating: 4 }),
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
      createItem<SinData>({ name: "Runner SIN", itemType: GearType.sin, rating: 4 }, [
        createItem<LicenseData>({ name: "Driver License", itemType: GearType.license, rating: 4 }),
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
      [sinId]: { id: sinId, name: "Handcrafted SIN", itemType: GearType.sin, rating: 4, childIds: [licenseId] },
      [licenseId]: { id: licenseId, name: "Handcrafted License", itemType: GearType.license, rating: 4, parentId: sinId },
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
