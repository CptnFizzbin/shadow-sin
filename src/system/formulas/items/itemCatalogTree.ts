import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ItemCatalog, ItemCatalogTree } from "#/system/model/items/itemUtils.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

export function toItemCatalogTree(catalog: ItemCatalog): ItemCatalogTree {
  const isRoot = (item: ItemData) => item.items.parentId === null || !(item.items.parentId in catalog)

  const buildNode = (id: UUID): [UUID, ItemCatalogTree[UUID]] => {
    const item = catalog[id]
    const childIds = item.items.childIds.filter((childId) => childId in catalog)

    return childIds.length > 0
      ? [id, { item, children: Object.fromEntries(childIds.map(buildNode)) }]
      : [id, { item }]
  }

  const rootIds = (Object.keys(catalog) as UUID[]).filter((id) => isRoot(catalog[id]))

  return Object.fromEntries(rootIds.map(buildNode))
}
