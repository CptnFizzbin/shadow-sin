import { useState } from "react"

import type { ItemForm } from "#/components/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

export interface ItemDialogOptionConfig {
  forced?: boolean
  enabled?: boolean
}

export type ItemOptionKey =
  | "equipable"
  | "licenseRequired"
  | "licenseAlwaysShow"
  | "hasRating"
  | "multiple"
  | "isSubItem"
  | "fixed"
  | "hasEffects"

export interface ItemOptionsDefaults {
  equipable?: ItemDialogOptionConfig
  licenseRequired?: ItemDialogOptionConfig
  hasRating?: ItemDialogOptionConfig
  multiple?: ItemDialogOptionConfig
  isSubItem?: ItemDialogOptionConfig
  hasEffects?: ItemDialogOptionConfig
}

function resolveEnabled(config: ItemDialogOptionConfig | undefined): boolean {
  // { forced: true, enabled: false } = force-disabled: never enable.
  if (config?.forced === true && config?.enabled === false) return false
  // { forced: true } = force-enabled: always on.
  if (config?.forced === true) return true
  return config?.enabled ?? false
}

function isForceDisabled(config: ItemDialogOptionConfig | undefined): boolean {
  return config?.forced === true && config?.enabled === false
}

/**
 * Computes the initial set of enabled options for an ItemDialog.
 *
 * Options can be force-enabled or force-disabled via defaults. When editing an
 * existing item, options are also auto-enabled for fields that already carry a
 * meaningful value, so previously-set data is always visible when the dialog
 * reopens.
 */
export function initializeOptions(
  initialValues: ItemData,
  isEditMode: boolean,
  defaults?: ItemOptionsDefaults,
): Record<ItemOptionKey, boolean> {
  return {
    equipable:
      resolveEnabled(defaults?.equipable)
      || (!isForceDisabled(defaults?.equipable) && isEditMode && initialValues.equipped !== undefined),
    licenseRequired: resolveEnabled(defaults?.licenseRequired),
    licenseAlwaysShow: false,
    // rating: 0 is not a meaningful value so is treated the same as undefined.
    hasRating:
      resolveEnabled(defaults?.hasRating)
      || (!isForceDisabled(defaults?.hasRating)
        && isEditMode
        && initialValues.rating !== undefined
        && initialValues.rating !== 0),
    // quantity defaults to 1 for every item; only enable "multiple" when the stored
    // quantity is explicitly greater than 1, indicating the user intentionally set it.
    multiple:
      resolveEnabled(defaults?.multiple)
      || (!isForceDisabled(defaults?.multiple) && isEditMode && (initialValues.quantity ?? 0) > 1),
    isSubItem:
      resolveEnabled(defaults?.isSubItem)
      || (!isForceDisabled(defaults?.isSubItem) && isEditMode && initialValues.parentId !== undefined),
    fixed: initialValues.fixed ?? false,
    hasEffects:
      resolveEnabled(defaults?.hasEffects)
      || (!isForceDisabled(defaults?.hasEffects) && isEditMode && initialValues.effects !== undefined),
  }
}

/**
 * Clears form field values that became stale when their controlling option was
 * toggled off. Only falsey values are cleared — truthy values are preserved so
 * the data is still available if the user re-enables the option in the same session.
 */
function clearStaleOptionFields(
  form: ItemForm,
  previousOptions: Record<ItemOptionKey, boolean>,
  updatedOptions: Record<ItemOptionKey, boolean>,
): void {
  if (previousOptions.equipable && !updatedOptions.equipable && !form.state.values.equipped) {
    form.setFieldValue("equipped", undefined)
  }
  if (previousOptions.hasRating && !updatedOptions.hasRating && !form.state.values.rating) {
    form.setFieldValue("rating", undefined)
  }
  if (previousOptions.multiple && !updatedOptions.multiple && !form.state.values.quantity) {
    form.setFieldValue("quantity", undefined)
  }
  if (previousOptions.isSubItem && !updatedOptions.isSubItem && !form.state.values.parentId) {
    form.setFieldValue("parentId", undefined)
  }
  if (previousOptions.hasEffects && !updatedOptions.hasEffects) {
    const currentEffects = form.state.values.effects
    if (!currentEffects || currentEffects.length === 0) {
      form.setFieldValue("effects", undefined)
    }
  }
}

/**
 * Manages the set of enabled options for an ItemDialog.
 *
 * On mount, options are automatically enabled for any field that already has a
 * meaningful value, so existing items always show their populated fields when
 * the dialog reopens.
 *
 * When an option is toggled off, the related form field is cleared to `undefined`
 * if its current value is falsey — avoiding stale data in the saved item.
 */
export function useItemOptions(
  form: ItemForm,
  defaults?: ItemOptionsDefaults,
): [Record<ItemOptionKey, boolean>, (updated: Record<ItemOptionKey, boolean>) => void] {
  const [options, setOptions] = useState<Record<ItemOptionKey, boolean>>(() => {
    const isEditMode = form.state.values.id !== NullUuid
    return initializeOptions(form.state.values, isEditMode, defaults)
  })

  const handleOptionsChange = (updated: Record<ItemOptionKey, boolean>) => {
    clearStaleOptionFields(form, options, updated)
    setOptions(updated)
  }

  return [options, handleOptionsChange]
}
