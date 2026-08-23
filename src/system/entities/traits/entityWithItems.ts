/**
 * The `{ parentId, childIds }` attachment position of an item within the parent/child gear
 * hierarchy. Not yet implemented by any real type — a preview of the shape
 * `docs/features/0015-entity-interface-decomposition.md` Slice 5 introduces.
 */
export interface EntityWithItems {
  items: {
    parentId: string | null
    childIds: string[]
  }
}
