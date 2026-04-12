import type { UUID } from "node:crypto"

import jsYaml from "js-yaml"

import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

export interface GearTreeNode extends Omit<ItemData, "parentId" | "childIds"> {
  children?: GearTreeNode[]
}

/**
 * Convert a flat gear map (Record<id, ItemData>) into a tree of nested GearTreeNodes.
 * Root items (those without a parentId) appear at the top level.
 * Each item's children are nested under a `children` array.
 * The `parentId` and `childIds` reference fields are omitted from every node.
 */
export function gearToTree(
  gear: Record<string, ItemData>,
): GearTreeNode[] {
  const buildNode = (item: ItemData): GearTreeNode => {
    const { childIds, parentId, ...rest } = item

    const children =
      childIds && childIds.length > 0
        ? childIds
            .map((childId) => gear[childId])
            .filter((child): child is ItemData => child !== undefined)
            .map(buildNode)
        : undefined

    return children ? { ...rest, children } : rest
  }

  return Object.values(gear)
    .filter((item) => !item.parentId)
    .map(buildNode)
}

/**
 * Serialise a CharacterBuilderState to a YAML string.
 * The gear map is converted to a nested tree before serialisation.
 */
export function characterSheetToYaml(
  state: CharacterSheet,
): string {
  const { gear, ...rest } = state

  const exportPayload = {
    ...rest,
    gear: gearToTree(gear),
  }

  return jsYaml.dump(exportPayload, { lineWidth: 120 })
}

/**
 * Flatten a tree of GearTreeNodes back into a Record<id, ItemData> suitable
 * for storing on CharacterSheet.gear.  parentId and childIds are reconstructed
 * from the tree structure.
 */
export function gearFromTree(
  nodes: GearTreeNode[],
  parentId?: UUID,
): Record<string, ItemData> {
  const result: Record<string, ItemData> = {}

  for (const node of nodes) {
    const { children, ...rest } = node
    const childIds = children ? children.map((child) => child.id) : []

    const item: ItemData = {
      ...rest,
      childIds: childIds.length > 0 ? childIds : undefined,
      parentId,
    }

    result[item.id] = item

    if (children && children.length > 0) {
      Object.assign(result, gearFromTree(children, item.id))
    }
  }

  return result
}

/**
 * Parse a YAML string (previously created by characterSheetToYaml) back into
 * a CharacterSheet.  The nested gear tree is flattened back to a flat map.
 */
export function yamlToCharacterSheet(
  yamlContent: string,
): CharacterSheet {
  const parsed = jsYaml.load(yamlContent) as Record<string, unknown>

  const gearTree = Array.isArray(parsed.gear) ? (parsed.gear as GearTreeNode[]) : []
  const gear = gearFromTree(gearTree)

  return {
    ...parsed,
    gear,
  } as CharacterSheet
}

/**
 * Trigger a browser file-download for the given text content.
 */
export function downloadTextFile(
  content: string,
  fileName: string,
  mimeType = "text/yaml",
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()

  URL.revokeObjectURL(url)
}
