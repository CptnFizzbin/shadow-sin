import { useIsBuilder } from "#/components/builder/useIsBuilder.ts"
import { useNuyenStore } from "#/components/character/finances/nuyen/useNuyenStore.ts"
import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"

export interface UseItemFormSubmitOptions<TItem> {
  mode: "edit" | "create"
  onSave: (item: TItem) => void | Promise<void>
  getItemCost: (item: TItem) => number
}

export interface UseItemFormSubmitResult<TItem> {
  handleSubmit: (item: TItem, meta?: GearSubmitMeta) => void
  isAcquireMode: boolean
}

/**
 * Centralises the acquire / purchase / save decision for all gear form dialogs.
 *
 * - In builder context OR when editing: calls `onSave(item)` directly.
 * - When creating outside builder with action "acquire": calls `onSave(item)` (no cost
 *   deduction — the item is added for free / outside normal purchase flow).
 * - When creating outside builder with action "purchase": calls `onSave(item)` then
 *   deducts `getItemCost(item)` from the character's nuyen after `onSave` resolves.
 */
export function useItemFormSubmit<TItem>({
  mode,
  onSave,
  getItemCost,
}: UseItemFormSubmitOptions<TItem>): UseItemFormSubmitResult<TItem> {
  const isBuilder = useIsBuilder()
  const nuyenStore = useNuyenStore()

  const isAcquireMode = mode === "create" && !isBuilder

  const handleSubmit = async (item: TItem, meta: GearSubmitMeta = defaultGearSubmitMeta) => {
    await onSave(item)
    if (isAcquireMode && meta.submitAction === "purchase") {
      nuyenStore.withdraw(getItemCost(item))
    }
  }

  return { handleSubmit, isAcquireMode }
}
