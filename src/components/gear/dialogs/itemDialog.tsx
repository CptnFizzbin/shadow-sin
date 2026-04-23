import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiSettings3Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { useState } from "react"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { GameEffectsFieldGroup } from "#/components/gameEffects/gameEffectsFieldGroup.tsx"
import { BuyQuantityDialog } from "#/components/gear/dialogs/buyQuantityDialog.tsx"
import { ItemDialogActions } from "#/components/gear/dialogs/itemDialogActions.tsx"
import { ItemOptionsDialog } from "#/components/gear/dialogs/itemOptionsDialog.tsx"
import type { ItemDialogOptionConfig } from "#/components/gear/dialogs/useItemOptions.ts"
import { useItemOptions } from "#/components/gear/dialogs/useItemOptions.ts"
import { GearAttachmentFieldGroup } from "#/components/gear/forms/gearAttachmentFieldGroup.tsx"
import { GearDescriptionFieldGroup } from "#/components/gear/forms/gearDescriptionFieldGroup.tsx"
import type { AnyItemForm, ItemForm } from "#/components/gear/forms/useItemForm.tsx"
import { itemFieldMap } from "#/components/gear/forms/useItemForm.tsx"
import { useIsBuilder } from "#/components/gear/useIsBuilder.ts"
import { SourceFieldGroup } from "#/components/sources/sourceFieldGroup.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import { GearCostFieldGroup } from "../forms/gearCostFieldGroup.tsx"
import { useGearStore } from "../useGearStore.ts"

export type { ItemDialogOptionConfig }

export interface ItemDialogProps {
  form: AnyItemForm
  title: ReactNode
  open: boolean
  onClose: () => void
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
  slots?: {
    /** Content rendered before the Name field (e.g. a category toggle). */
    preForm?: () => ReactNode
    attachmentFields?: () => ReactNode
    itemFields?: () => ReactNode
  }
  options?: {
    equipable?: ItemDialogOptionConfig
    licenseRequired?: ItemDialogOptionConfig
    hasRating?: ItemDialogOptionConfig
    multiple?: ItemDialogOptionConfig
    isSubItem?: ItemDialogOptionConfig
    hasEffects?: ItemDialogOptionConfig
  }
}

function resolveForced(config: ItemDialogOptionConfig | undefined): boolean {
  return config?.forced === true
}

export const ItemDialog: FC<ItemDialogProps> = ({
  form: formArg,
  title,
  open,
  onClose,
  onClosed,
  onDelete,
  getCost,
  parentItemFilter,
  parentItemLabel,
  ratingMax,
  slots,
  options: optionsProp,
}) => {
  // Cast once from AnyItemForm to ItemForm for use with the typed field group
  // components. ItemDialog only accesses ItemData fields from the form, so this is safe.
  const form = formArg as ItemForm
  const isBuilder = useIsBuilder()
  const nuyenStore = useNuyenStore()
  const gearStore = useGearStore()

  type OptionKey = keyof Required<NonNullable<typeof optionsProp>>

  const forced: Record<OptionKey, boolean> = {
    equipable: resolveForced(optionsProp?.equipable),
    licenseRequired: resolveForced(optionsProp?.licenseRequired),
    hasRating: resolveForced(optionsProp?.hasRating),
    multiple: resolveForced(optionsProp?.multiple),
    isSubItem: resolveForced(optionsProp?.isSubItem),
    hasEffects: resolveForced(optionsProp?.hasEffects),
  }

  const [localOptions, handleOptionsChange] = useItemOptions(form, optionsProp)

  const [optionsOpen, setOptionsOpen] = useState(false)
  const [buyOpen, setBuyOpen] = useState(false)

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
      nuyenStore.withdraw(totalCost)
    }
  }

  const handleBuyPurchase = (quantity: number, totalCost: number) => {
    const currentQuantity = form.state.values.quantity ?? 0
    form.setFieldValue("quantity", currentQuantity + quantity)
    setBuyOpen(false)
    nuyenStore.withdraw(totalCost)
  }

  const allItems = gearStore.search([])
  const currentItemId = form.state.values.id
  const parentItemOptions = allItems
    .filter((gear) => gear.id !== currentItemId)
    .filter((gear) => (parentItemFilter ? parentItemFilter(gear) : true))
    .map((gear) => ({ label: gear.name, value: gear.id }))

  return (
    <>
      <Dialog open={open} fullWidth onClose={onClose} onTransitionExited={onClosed}>
        <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

        <DialogContent sx={{ padding: 1 }}>
          <Stack sx={{ gap: 1, padding: 1 }}>
            {slots?.preForm?.()}

            <Stack direction="row" sx={{ gap: 1, alignItems: "flex-start" }}>
              <form.AppField
                name="name"
                validators={{ onChange: z.string().min(1, "Name is required") }}
              >
                {(field) => (
                  <field.TextField label="Name" size="small" sx={{ flex: 1 }} autoFocus />
                )}
              </form.AppField>

              {localOptions["hasRating"] && (
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

              <IconButton
                size="small"
                sx={{ ml: "auto" }}
                onClick={() => setOptionsOpen(true)}
                aria-label="Item options"
              >
                <RiSettings3Line size={18} />
              </IconButton>
            </Stack>

            <GearCostFieldGroup
              form={form}
              fields={itemFieldMap}
              enableQuantity={localOptions["multiple"]}
              onBuyMore={(!isBuilder && !isNewItem) ? () => setBuyOpen(true) : undefined}
            />

            <AvailabilityFieldGroup form={form} fields="availability" />

            {localOptions["isSubItem"] && (
              <Stack sx={{ gap: 1 }}>
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
        </DialogContent>

        <DialogActions sx={{ padding: 1 }}>
          <form.Subscribe
            selector={(state) => getCost
              ? getCost(state.values)
              : (state.values.cost ?? 0) * (state.values.quantity ?? 1)}
          >
            {(totalCost) => (
              <ItemDialogActions
                isAcquireMode={isAcquireMode}
                totalCost={totalCost}
                onClose={onClose}
                onAcquire={() => handleSubmitWithAction("acquire")}
                onPurchase={() => handleSubmitWithAction("purchase")}
                onSave={() => handleSubmitWithAction("save")}
                onDelete={onDelete}
              />
            )}
          </form.Subscribe>
        </DialogActions>
      </Dialog>

      <ItemOptionsDialog
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        options={localOptions}
        forced={forced}
        onChange={handleOptionsChange}
      />

      {buyOpen && (
        <BuyQuantityDialog
          open={buyOpen}
          defaultCost={form.state.values.cost ?? 0}
          onClose={() => setBuyOpen(false)}
          onPurchase={handleBuyPurchase}
        />
      )}
    </>
  )
}
