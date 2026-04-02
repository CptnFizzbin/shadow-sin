import { describe, expect, it, vi } from "vitest"

import type { ItemData } from "#/lib/system/ItemData.ts"

import { characterSheetToYaml, downloadTextFile, gearToTree } from "./ExportUtils.ts"

// Minimal helper for creating ItemData in tests
function makeItem(
  id: string,
  name: string,
  opts: Partial<ItemData> = {},
): ItemData {
  return {
    id: id as ItemData["id"],
    name,
    itemType: "gear",
    ...opts,
  }
}

describe("gearToTree", () => {
  it("returns an empty array for an empty gear map", () => {
    // Arrange / Act
    const result = gearToTree({})

    // Assert
    expect(result).toEqual([])
  })

  it("returns a single root item with no children when no parent/child relationships exist", () => {
    // Arrange
    const item = makeItem("item-1", "Sword")
    const gear = { "item-1": item }

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe("item-1")
    expect(result[0]!.name).toBe("Sword")
    expect(result[0]!.children).toBeUndefined()
  })

  it("omits parentId and childIds from result nodes", () => {
    // Arrange
    const parent = makeItem("parent-1", "Rig", { childIds: ["child-1" as ItemData["id"]] })
    const child = makeItem("child-1", "Drone", { parentId: "parent-1" as ItemData["id"] })
    const gear = { "parent-1": parent, "child-1": child }

    // Act
    const result = gearToTree(gear)

    // Assert
    expect("parentId" in result[0]!).toBe(false)
    expect("childIds" in result[0]!).toBe(false)
    expect("parentId" in result[0]!.children![0]!).toBe(false)
    expect("childIds" in result[0]!.children![0]!).toBe(false)
  })

  it("nests children under their parent node", () => {
    // Arrange
    const parent = makeItem("parent-1", "Rig", { childIds: ["child-1" as ItemData["id"]] })
    const child = makeItem("child-1", "Drone", { parentId: "parent-1" as ItemData["id"] })
    const gear = { "parent-1": parent, "child-1": child }

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe("Rig")
    expect(result[0]!.children).toHaveLength(1)
    expect(result[0]!.children![0]!.name).toBe("Drone")
  })

  it("filters out items that have a parentId from the root level", () => {
    // Arrange
    const parent = makeItem("parent-1", "Parent", { childIds: ["child-1" as ItemData["id"]] })
    const child = makeItem("child-1", "Child", { parentId: "parent-1" as ItemData["id"] })
    const gear = { "parent-1": parent, "child-1": child }

    // Act
    const result = gearToTree(gear)

    // Assert - only root items (no parentId) at top level
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe("parent-1")
  })

  it("handles multiple root items", () => {
    // Arrange
    const item1 = makeItem("item-1", "Pistol")
    const item2 = makeItem("item-2", "Armor")
    const gear = { "item-1": item1, "item-2": item2 }

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(2)
    const names = result.map((n) => n.name)
    expect(names).toContain("Pistol")
    expect(names).toContain("Armor")
  })

  it("handles deeply nested children (grandchildren)", () => {
    // Arrange
    const grandparent = makeItem("gp", "Grandparent", { childIds: ["p" as ItemData["id"]] })
    const parent = makeItem("p", "Parent", {
      parentId: "gp" as ItemData["id"],
      childIds: ["c" as ItemData["id"]],
    })
    const child = makeItem("c", "Child", { parentId: "p" as ItemData["id"] })
    const gear = { gp: grandparent, p: parent, c: child }

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe("Grandparent")
    expect(result[0]!.children![0]!.name).toBe("Parent")
    expect(result[0]!.children![0]!.children![0]!.name).toBe("Child")
  })

  it("skips missing child references gracefully", () => {
    // Arrange
    const parent = makeItem("parent-1", "Parent", {
      childIds: ["missing-child" as ItemData["id"]],
    })
    const gear = { "parent-1": parent }

    // Act
    const result = gearToTree(gear)

    // Assert - all missing references are filtered out, resulting in an empty children array
    // (empty array is returned because the childIds list is non-empty but all referents are missing)
    expect(result).toHaveLength(1)
    expect(result[0]!.children).toEqual([])
  })

  it("returns no children property when childIds is empty", () => {
    // Arrange
    const item = makeItem("item-1", "Item", { childIds: [] })
    const gear = { "item-1": item }

    // Act
    const result = gearToTree(gear)

    // Assert
    expect(result[0]!.children).toBeUndefined()
  })
})

describe("characterSheetToYaml", () => {
  it("returns a non-empty YAML string", () => {
    // Arrange
    const sheet = {
      id: "test-id",
      name: "Test Character",
      gear: {},
    } as Parameters<typeof characterSheetToYaml>[0]

    // Act
    const yaml = characterSheetToYaml(sheet)

    // Assert
    expect(typeof yaml).toBe("string")
    expect(yaml.length).toBeGreaterThan(0)
  })

  it("includes character data in the YAML output", () => {
    // Arrange
    const sheet = {
      id: "abc-123",
      gear: {},
      profile: { alias: "Shadowrunner" },
    } as Parameters<typeof characterSheetToYaml>[0]

    // Act
    const yaml = characterSheetToYaml(sheet)

    // Assert
    expect(yaml).toContain("Shadowrunner")
  })

  it("converts gear map to a tree in the YAML output", () => {
    // Arrange
    const item = makeItem("item-1", "Pistol")
    const sheet = {
      id: "test-id",
      gear: { "item-1": item },
    } as Parameters<typeof characterSheetToYaml>[0]

    // Act
    const yaml = characterSheetToYaml(sheet)

    // Assert
    expect(yaml).toContain("Pistol")
  })

  it("does not contain 'parentId' or 'childIds' keys in gear output", () => {
    // Arrange
    const parent = makeItem("parent-1", "Rig", { childIds: ["child-1" as ItemData["id"]] })
    const child = makeItem("child-1", "Drone", { parentId: "parent-1" as ItemData["id"] })
    const sheet = {
      id: "test-id",
      gear: { "parent-1": parent, "child-1": child },
    } as Parameters<typeof characterSheetToYaml>[0]

    // Act
    const yaml = characterSheetToYaml(sheet)

    // Assert
    expect(yaml).not.toContain("parentId")
    expect(yaml).not.toContain("childIds")
  })
})

describe("downloadTextFile", () => {
  it("creates an anchor element and triggers a download", () => {
    // Arrange
    const mockClick = vi.fn()
    const mockAnchor = {
      href: "",
      download: "",
      click: mockClick,
    }
    vi.spyOn(document, "createElement").mockReturnValueOnce(mockAnchor as unknown as HTMLElement)
    const mockUrl = "blob:http://localhost/fake-url"
    vi.spyOn(URL, "createObjectURL").mockReturnValueOnce(mockUrl)
    const mockRevokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementationOnce(() => {})

    // Act
    downloadTextFile("file content", "export.yaml")

    // Assert
    expect(mockAnchor.href).toBe(mockUrl)
    expect(mockAnchor.download).toBe("export.yaml")
    expect(mockClick).toHaveBeenCalledOnce()
    expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockUrl)
  })

  it("uses text/yaml as default MIME type", () => {
    // Arrange
    const capturedBlobs: Blob[] = []
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      capturedBlobs.push(blob as Blob)
      return "blob:fake"
    })
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
    vi.spyOn(document, "createElement").mockReturnValueOnce({
      href: "",
      download: "",
      click: vi.fn(),
    } as unknown as HTMLElement)

    // Act
    downloadTextFile("content", "file.yaml")

    // Assert
    expect(capturedBlobs[0]!.type).toBe("text/yaml")
  })

  it("uses the provided MIME type when specified", () => {
    // Arrange
    const capturedBlobs: Blob[] = []
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      capturedBlobs.push(blob as Blob)
      return "blob:fake"
    })
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
    vi.spyOn(document, "createElement").mockReturnValueOnce({
      href: "",
      download: "",
      click: vi.fn(),
    } as unknown as HTMLElement)

    // Act
    downloadTextFile("content", "file.json", "application/json")

    // Assert
    expect(capturedBlobs[0]!.type).toBe("application/json")
  })

  it("revokes the object URL after the download is triggered", () => {
    // Arrange
    const mockUrl = "blob:fake-url"
    vi.spyOn(URL, "createObjectURL").mockReturnValueOnce(mockUrl)
    const revokespy = vi.spyOn(URL, "revokeObjectURL").mockImplementationOnce(() => {})
    vi.spyOn(document, "createElement").mockReturnValueOnce({
      href: "",
      download: "",
      click: vi.fn(),
    } as unknown as HTMLElement)

    // Act
    downloadTextFile("data", "output.yaml")

    // Assert
    expect(revokespy).toHaveBeenCalledWith(mockUrl)
  })
})