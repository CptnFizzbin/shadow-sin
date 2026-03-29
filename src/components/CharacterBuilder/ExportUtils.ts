import jsYaml from "js-yaml"

import type { CharacterBuilderState } from "#/components/CharacterBuilder/CharacterBuilderState.ts"
import type { ItemData } from "#/lib/system/ItemData.ts"

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
export function characterBuilderStateToYaml(
  state: CharacterBuilderState,
): string {
  const { gear, ...rest } = state

  const exportPayload = {
    ...rest,
    gear: gearToTree(gear),
  }

  return jsYaml.dump(exportPayload, { lineWidth: 120 })
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
