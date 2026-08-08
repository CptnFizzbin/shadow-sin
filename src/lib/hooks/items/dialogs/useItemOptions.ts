import { useState } from "react"

import type { ItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

export interface ItemDialogOptionConfig {
  forced?: boolean
  enabled?: boolean
}

export type ItemOptionKey =
  | "equipable"
  | "canBeStashed"
  | "hasRating"
  | "multiple"
  | "isSubItem"
  | "fixed"
  | "hasEffects"
  | "showCost"
  | "showAvailability"

export interface ItemOptionsDefaults {
  equipable?: ItemDialogOptionConfig
  canBeStashed?: ItemDialogOptionConfig
  hasRating?: ItemDialogOptionConfig
  multiple?: ItemDialogOptionConfig
  isSubItem?: ItemDialogOptionConfig
  hasEffects?: ItemDialogOptionConfig
  showCost?: ItemDialogOptionConfig
  showAvailability?: ItemDialogOptionConfig
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
    // canBeStashed defaults to true (Stash applies to virtually every item) unless force-disabled —
    // same pattern as showCost/showAvailability below.
    canBeStashed: resolveEnabled(defaults?.canBeStashed) || !isForceDisabled(defaults?.canBeStashed),
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
    // showCost and showAvailability default to true (always visible) unless force-disabled.
    showCost: resolveEnabled(defaults?.showCost) || !isForceDisabled(defaults?.showCost),
    showAvailability: resolveEnabled(defaults?.showAvailability) || !isForceDisabled(defaults?.showAvailability),
  }
}

/**
 * Clears the form field that becomes stale when its controlling option is toggled
 * off. Only a falsey value is cleared — a truthy value is preserved so the data
 * is still available if the user re-enables the option in the same session.
 */
function clearStaleOptionField(
  form: ItemForm,
  key: ItemOptionKey,
): void {
  switch (key) {
    case "equipable":
      if (!form.state.values.equipped) {
        form.setFieldValue("equipped", undefined)
      }
      break
    case "canBeStashed":
      if (!form.state.values.stashed) {
        form.setFieldValue("stashed", undefined)
      }
      break
    case "hasRating":
      if (!form.state.values.rating) {
        form.setFieldValue("rating", undefined)
      }
      break
    case "multiple":
      if (!form.state.values.quantity) {
        form.setFieldValue("quantity", undefined)
      }
      break
    case "isSubItem":
      if (!form.state.values.parentId) {
        form.setFieldValue("parentId", undefined)
      }
      break
    case "hasEffects": {
      const currentEffects = form.state.values.effects
      if (!currentEffects || currentEffects.length === 0) {
        form.setFieldValue("effects", undefined)
      }
      break
    }
    default:
      // No form field to clear for fixed
      break
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
): [Record<ItemOptionKey, boolean>, (key: ItemOptionKey, value: boolean) => void] {
  const [options, setOptions] = useState<Record<ItemOptionKey, boolean>>(() => {
    const isEditMode = form.state.values.id !== NullUuid
    return initializeOptions(form.state.values, isEditMode, defaults)
  })

  const handleOptionChange = (key: ItemOptionKey, value: boolean) => {
    if (!value) {
      clearStaleOptionField(form, key)
    }
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  return [options, handleOptionChange]
}
