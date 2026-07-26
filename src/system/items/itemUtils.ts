import type { ItemData } from "#/system/itemData.ts"

export function isEquipped(item: ItemData): boolean {
  return item.equipped === true
}

// TODO(#388): Stubbed pending item-stashing (docs/features/0012-item-stashing.md). Once
// ItemData carries a real `_state.stashed` flag, read it here instead of hardcoding `false`.
export function isStashed(_item: ItemData): boolean {
  return false
}

// TODO(#388): Stubbed pending item-stashing. Conceptually `!isStashed(item)`, but hardcoded
// `true` since `isStashed` always returns `false` today — replace with `!isStashed(item)` once
// the real `_state.stashed` flag exists and isStashed reads it.
export function isAvailable(_item: ItemData): boolean {
  return true
}
