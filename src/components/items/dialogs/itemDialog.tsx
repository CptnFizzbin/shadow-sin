import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import { RiDiceLine, RiSettings3Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/items/availability/availabilityFieldGroup.tsx"
import { GearAttachmentFieldGroup } from "#/components/items/forms/gearAttachmentFieldGroup.tsx"
import { GearCostFieldGroup } from "#/components/items/forms/gearCostFieldGroup.tsx"
import { GearDescriptionFieldGroup } from "#/components/items/forms/gearDescriptionFieldGroup.tsx"
import { GameEffectsFieldGroup } from "#/components/system/gameEffects/gameEffectsFieldGroup.tsx"
import { SourceFieldGroup } from "#/components/system/sources/sourceFieldGroup.tsx"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { useIsBuilder } from "#/contexts/builder/builderStore.context.ts"
import type { ItemDialogOptionConfig } from "#/hooks/items/dialogs/useItemOptions.ts"
import { useItemOptions } from "#/hooks/items/dialogs/useItemOptions.ts"
import type { AnyItemForm, ItemForm } from "#/hooks/items/forms/useItemForm.tsx"
import { itemFieldMap } from "#/hooks/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { ItemSelectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useBuyQuantityDialog } from "./buyQuantityDialog.tsx"
import { ItemDialogActions } from "./itemDialogActions.tsx"
import { useItemOptionsDialog } from "./itemOptionsDialog.tsx"

export interface ItemDialogProps {
  form: AnyItemForm
  title: ReactNode
  ctrl: AnyDialogCtrl
  /** Called after the exit animation completes (e.g. to reset form state). */
  onClosed?: () => void
  onDelete?: () => void
  /** Override the total cost calculation used for display and nuyen withdrawal. Defaults to `cost × quantity`. */
  getCost?: (values: ItemData) => number
  /** Filter which gear items appear in the "Attached To" parent dropdown. */
  parentItemFilter?: (item: ItemData) => boolean
  /** Override the "Attached To" section label and the parent select field label. */
  parentItemLabel?: string
  /** Maximum value for the hasRating CounterField. Defaults to 12. */
  ratingMax?: number
  /** When provided, shows a dice button in the Name field that fills it with a random suggestion (e.g. a cover name for a SIN). */
  onRandomizeName?: () => string
  slots?: {
    /** Content rendered before the Name field (e.g. a category toggle). */
    preForm?: () => ReactNode
    /** Replaces the default rating CounterField, rendered after Name in the same row. */
    rating?: () => ReactNode
    attachmentFields?: () => ReactNode
    itemFields?: () => ReactNode
  }
  options?: {
    equipable?: ItemDialogOptionConfig
    canBeStashed?: ItemDialogOptionConfig
    hasRating?: ItemDialogOptionConfig
    multiple?: ItemDialogOptionConfig
    isSubItem?: ItemDialogOptionConfig
    hasEffects?: ItemDialogOptionConfig
    showCost?: ItemDialogOptionConfig
    showAvailability?: ItemDialogOptionConfig
  }
}

function resolveForced(config: ItemDialogOptionConfig | undefined): boolean {
  return config?.forced === true
}

export const ItemDialog: FC<ItemDialogProps> = ({
  form: formArg,
  title,
  ctrl,
  onClosed,
  onDelete,
  getCost,
  parentItemFilter,
  parentItemLabel,
  ratingMax,
  slots,
  options: optionsProp,
  onRandomizeName,
}) => {
  // Cast once from AnyItemForm to ItemForm for use with the typed field group
  // components. ItemDialog only accesses ItemData fields from the form, so this is safe.
  const form = formArg as ItemForm
  const isBuilder = useIsBuilder()
  const dispatch = useRunnerStoreDispatch()
  const allGear = useRunnerSelector(ItemSelectors.selectAll)

  type OptionKey = keyof Required<NonNullable<typeof optionsProp>>

  const forced: Record<OptionKey, boolean> = {
    equipable: resolveForced(optionsProp?.equipable),
    canBeStashed: resolveForced(optionsProp?.canBeStashed),
    hasRating: resolveForced(optionsProp?.hasRating),
    multiple: resolveForced(optionsProp?.multiple),
    isSubItem: resolveForced(optionsProp?.isSubItem),
    hasEffects: resolveForced(optionsProp?.hasEffects),
    showCost: resolveForced(optionsProp?.showCost),
    showAvailability: resolveForced(optionsProp?.showAvailability),
  }

  const [localOptions, handleOptionsChange] = useItemOptions(form, optionsProp)

  const itemOptionsDialog = useItemOptionsDialog()
  const buyQuantityDialog = useBuyQuantityDialog()

  const isNewItem = form.state.values.id === NullUuid
  const isAcquireMode = isNewItem && !isBuilder

  const handleSubmitWithAction = async (submitAction: "acquire" | "purchase" | "save") => {
    try {
      await form.handleSubmit({ submitAction })
    } catch {
      // TanStack Form re-throws errors from onSubmit after setting
      // isSubmitSuccessful to false. Swallow the re-throw here — the
      // isSubmitSuccessful check below prevents the nuyen deduction.
    }
    if (submitAction === "purchase" && form.state.isSubmitSuccessful) {
      const values = form.state.values
      const totalCost = getCost
        ? getCost(values)
        : (values.cost ?? 0) * (values.quantity ?? 1)
      dispatch(Actions.nuyen.withdrawNuyen(totalCost))
    }
  }

  const handleBuyPurchase = (quantity: number, totalCost: number) => {
    const currentQuantity = form.state.values.quantity ?? 0
    form.setFieldValue("quantity", currentQuantity + quantity)
    dispatch(Actions.nuyen.withdrawNuyen(totalCost))
  }

  const allItems = Object.values(allGear)
  const currentItemId = form.state.values.id
  const parentItemOptions = allItems
    .filter((gear) => gear.id !== currentItemId)
    .filter((gear) => (parentItemFilter ? parentItemFilter(gear) : true))
    .map((gear) => ({ label: gear.name, value: gear.id }))

  return (
    <>
      <ControlledDialog ctrl={ctrl} onClose={false} onClosed={onClosed}>
        <Dialog.Title>{title}</Dialog.Title>

        <Dialog.Content>
          <Stack sx={{ padding: 1 }}>
            {slots?.preForm?.()}

            <Stack direction="row" sx={{ alignItems: "flex-start" }}>
              <form.AppField
                name="name"
                validators={{ onChange: z.string().min(1, "Name is required") }}
              >
                {(field) => (
                  <field.TextField
                    label="Name"
                    size="small"
                    sx={{ flex: 1 }}
                    autoFocus
                    slotProps={onRandomizeName
                      ? {
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  aria-label="Randomize name"
                                  onClick={() => field.handleChange(onRandomizeName())}
                                >
                                  <RiDiceLine size={18} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }
                      : undefined}
                  />
                )}
              </form.AppField>

              {slots?.rating
                ? slots.rating()
                : localOptions["hasRating"] && (
                  <form.AppField name="rating">
                    {(field) => (
                      <field.CounterField label="Rating" min={1} max={ratingMax ?? 12} />
                    )}
                  </form.AppField>
                )}
            </Stack>

            <Divider />

            <Stack direction="row" sx={{ alignItems: "center" }}>
              {localOptions["equipable"] && (
                <form.AppField name="equipped">
                  {(field) => <field.SwitchField label="Equipped" />}
                </form.AppField>
              )}

              {localOptions["canBeStashed"] && (
                <form.AppField name="stashed">
                  {(field) => <field.SwitchField label="Stashed" />}
                </form.AppField>
              )}

              <IconButton
                size="small"
                sx={{ ml: "auto" }}
                onClick={() => itemOptionsDialog.open({
                  initialOptions: localOptions,
                  forced,
                  onChange: handleOptionsChange,
                })}
                aria-label="Item options"
              >
                <RiSettings3Line size={18} />
              </IconButton>
            </Stack>

            {localOptions["showCost"] && (
              <GearCostFieldGroup
                form={form}
                fields={itemFieldMap}
                enableQuantity={localOptions["multiple"]}
                onBuyMore={(!isBuilder && !isNewItem)
                  ? () => buyQuantityDialog.open({
                      defaultCost: form.state.values.cost ?? 0,
                      onPurchase: handleBuyPurchase,
                    })
                  : undefined}
              />
            )}

            {localOptions["showAvailability"] && (
              <AvailabilityFieldGroup form={form} fields="availability" />
            )}

            {localOptions["isSubItem"] && (
              <Stack>
                <Label label={parentItemLabel ?? "Attached To"} />

                <GearAttachmentFieldGroup
                  form={form}
                  fields={itemFieldMap}
                  isFixed={localOptions["fixed"] ?? false}
                  parentItemOptions={parentItemOptions}
                  fieldLabel={parentItemLabel ?? "Parent Item"}
                  attachmentSlot={slots?.attachmentFields}
                />
              </Stack>
            )}

            {slots?.itemFields?.()}

            <Label label="Description" />

            <GearDescriptionFieldGroup form={form} fields={itemFieldMap} />

            <Label label="Source" />
            <SourceFieldGroup form={form} fields={itemFieldMap} />

            {localOptions["hasEffects"] && (
              <GameEffectsFieldGroup form={form} fields={{ effects: "effects" }} />
            )}
          </Stack>
        </Dialog.Content>

        <Dialog.Actions>
          <form.Subscribe
            selector={(state) => getCost
              ? getCost(state.values)
              : (state.values.cost ?? 0) * (state.values.quantity ?? 1)}
          >
            {(totalCost) => (
              <ItemDialogActions
                isAcquireMode={isAcquireMode}
                totalCost={totalCost}
                onClose={() => ctrl.close()}
                onAcquire={() => handleSubmitWithAction("acquire")}
                onPurchase={() => handleSubmitWithAction("purchase")}
                onSave={() => handleSubmitWithAction("save")}
                onDelete={onDelete}
              />
            )}
          </form.Subscribe>
        </Dialog.Actions>
      </ControlledDialog>

      {itemOptionsDialog.outlet}
      {buyQuantityDialog.outlet}
    </>
  )
}
