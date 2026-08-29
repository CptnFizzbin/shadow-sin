import { dump, load } from "js-yaml"

import { applyMigrations } from "#/data/applyMigrations.ts"
import type { JsonObject } from "#/lib/jsonUtils.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"

export interface GearTreeNode extends Omit<ItemData, "items"> {
  children?: GearTreeNode[]
}

/** YAML export shape: `RunnerData` with `_data_.items` replaced by a nested `gear` tree. */
type RunnerExportPayload = Omit<RunnerData, "_data_"> & {
  _data_: Omit<RunnerData["_data_"], "items">
  gear: GearTreeNode[]
}

/**
 * Convert a flat gear map (Record<id, ItemData>) into a tree of nested GearTreeNodes.
 * Root items (those without a parentId) appear at the top level.
 * Each item's children are nested under a `children` array.
 * The `items` (`parentId`/`childIds`) attachment field is omitted from every node.
 */
export function gearToTree(
  gear: Record<string, ItemData>,
): GearTreeNode[] {
  const buildNode = (item: ItemData): GearTreeNode => {
    const { items, ...rest } = item

    const children =
      items.childIds.length > 0
        ? items.childIds
            .map((childId) => gear[childId])
            .filter((child): child is ItemData => child !== undefined)
            .map(buildNode)
        : undefined

    return children ? { ...rest, children } : rest
  }

  return Object.values(gear)
    .filter((item) => !item.items.parentId)
    .map(buildNode)
}

/**
 * Serialise a RunnerData to a YAML string.
 * `_data_.items` (the flat gear map) is converted to a nested `gear` tree before serialisation.
 */
export function runnerDataToYaml(
  state: RunnerData,
): string {
  const { _data_, ...rest } = state
  const { items: _items, ...restData } = _data_

  const exportPayload: RunnerExportPayload = {
    ...rest,
    _data_: restData,
    gear: gearToTree(getItemCatalog(state)),
  }

  return dump(exportPayload, { lineWidth: 120 })
}

/**
 * Flatten a tree of GearTreeNodes back into a Record<id, ItemData> suitable
 * for storing on RunnerData._data_.items.  The `items` attachment field
 * (`parentId`/`childIds`) is reconstructed from the tree structure.
 */
export function gearFromTree(
  nodes: GearTreeNode[],
  parentId: UUID | null = null,
): Record<string, ItemData> {
  const result: Record<string, ItemData> = {}

  for (const node of nodes) {
    const { children, ...rest } = node
    const childIds = children ? children.map((child) => child.id) : []

    const item: ItemData = {
      ...rest,
      items: { parentId, childIds },
    }

    result[item.id] = item

    if (children && children.length > 0) {
      Object.assign(result, gearFromTree(children, item.id))
    }
  }

  return result
}

/**
 * Parse a YAML string back into a RunnerData.
 *
 * For current-format runners the nested gear tree is flattened back to a
 * flat map.  For old-format runners (those with a top-level `runnerId`
 * field) the gear array is left untouched so that the migration pipeline can
 * perform the full normalisation (itemType renaming, sinId → parentId, etc.).
 *
 * Migrations are always run on the parsed data so that any runner —
 * regardless of which version it was exported from — is returned as a fully
 * up-to-date {@link RunnerData}.
 */
export function yamlToRunnerData(
  yamlContent: string,
): RunnerData {
  const parsed = load(yamlContent) as JsonObject
  const isOldFormat = "characterId" in parsed
  const rawGear: unknown = parsed.gear

  const payload = isOldFormat
    ? parsed
    : {
        ...parsed,
        _data_: {
          ...(parsed._data_ as object | undefined),
          items: gearFromTree(Array.isArray(rawGear) ? (rawGear as GearTreeNode[]) : []),
        },
      }

  return applyMigrations(payload)
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
