import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import { RiSettings3Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { useState } from "react"
import { z } from "zod"

import { AvailabilityFieldGroup } from "#/components/availablity/availabilityFieldGroup.tsx"
import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { GameEffectsFieldGroup } from "#/components/gameEffects/gameEffectsFieldGroup.tsx"
import { BuyQuantityDialog } from "#/components/gear/dialogs/buyQuantityDialog.tsx"
import type { ItemOptionFlags, ItemOptionForced } from "#/components/gear/dialogs/itemOptionsDialog.tsx"
import { ItemOptionsDialog } from "#/components/gear/dialogs/itemOptionsDialog.tsx"
import type { ItemForm, ItemFormOptions } from "#/components/gear/forms/useItemForm.tsx"
import { gearItemFieldMap, useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import { useIsBuilder } from "#/components/gear/useIsBuilder.ts"
import { SourceFieldGroup } from "#/components/sources/sourceFieldGroup.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"

export interface ItemDialogOptionConfig {
  forced?: boolean
  enabled?: boolean
}

export interface ItemDialogProps {
  item?: ItemData
  itemType?: ItemType
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (item: ItemData) => void | Promise<void>
  label?: string
  slots?: {
    attachmentFields?: (form: ItemForm) => ReactNode
    itemFields?: (form: ItemForm) => ReactNode
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

function resolveEnabled(config: ItemDialogOptionConfig | undefined): boolean {
  return (config?.forced ?? false) || (config?.enabled ?? false)
}

function resolveForced(config: ItemDialogOptionConfig | undefined): boolean {
  return config?.forced ?? false
}

export const ItemDialog: FC<ItemDialogProps> = ({
  item,
  itemType,
  open,
  onClose,
  onClosed,
  onSave,
  label = "Item",
  slots,
  options: optionsProp,
}) => {
  const isBuilder = useIsBuilder()
  const nuyenStore = useNuyenStore()
  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const gearStore = useGearStore()

  const forced: ItemOptionForced = {
    equipable: resolveForced(optionsProp?.equipable),
    licenseRequired: resolveForced(optionsProp?.licenseRequired),
    hasRating: resolveForced(optionsProp?.hasRating),
    multiple: resolveForced(optionsProp?.multiple),
    isSubItem: resolveForced(optionsProp?.isSubItem),
    hasEffects: resolveForced(optionsProp?.hasEffects),
  }

  const [localOptions, setLocalOptions] = useState<ItemOptionFlags>({
    equipable: resolveEnabled(optionsProp?.equipable),
    licenseRequired: resolveEnabled(optionsProp?.licenseRequired),
    licenseAlwaysShow: false,
    hasRating: resolveEnabled(optionsProp?.hasRating),
    multiple: resolveEnabled(optionsProp?.multiple),
    isSubItem: resolveEnabled(optionsProp?.isSubItem),
    fixed: item?.fixed ?? false,
    hasEffects: resolveEnabled(optionsProp?.hasEffects),
  })

  const [optionsOpen, setOptionsOpen] = useState(false)
  const [buyOpen, setBuyOpen] = useState(false)

  const isNewItem = !item || item.id === NullUuid
  const isAcquireMode = isNewItem && !isBuilder

  const formOptions: ItemFormOptions = {
    item,
    itemType,
    onSubmit: async (submittedItem, meta) => {
      await onSave(submittedItem)
      if (meta.submitAction === "purchase") {
        nuyenStore.withdraw(submittedItem.cost ?? 0)
      }
    },
  }

  const form = useItemForm(formOptions)

  const handleSubmitWithAction = (submitAction: "acquire" | "purchase" | "save") => {
    form.handleSubmit({ submitAction })
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
    .map((gear) => ({ label: gear.name, value: gear.id }))

  const title = isNewItem ? `Add ${label}` : `Edit ${label}`

  return (
    <>
      <Dialog open={open} fullWidth onClose={onClose} onTransitionExited={onClosed}>
        <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

        <DialogContent sx={{ padding: 1 }}>
          <Stack sx={{ gap: 1, padding: 1 }}>
            {/* Name + Rating */}
            <Stack direction="row" sx={{ gap: 1, alignItems: "flex-start" }}>
              <form.AppField
                name="name"
                validators={{ onChange: z.string().min(1, "Name is required") }}
              >
                {(field) => (
                  <field.TextField label="Name" size="small" sx={{ flex: 1 }} autoFocus />
                )}
              </form.AppField>

              {localOptions.hasRating && (
                <form.AppField
                  name="rating"
                  validators={{
                    onChange: z
                      .number()
                      .int("Rating must be a whole number")
                      .min(1, "Rating must be at least 1")
                      .optional(),
                  }}
                >
                  {(field) => (
                    <field.CounterField label="Rating" min={1} max={12} />
                  )}
                </form.AppField>
              )}
            </Stack>

            <Divider />

            {/* Equipped toggle + Options button */}
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              {localOptions.equipable
                ? (
                    <form.AppField name="equipped">
                      {(field) => (
                        <FormControlLabel
                          control={(
                            <Switch
                              checked={field.state.value ?? false}
                              onChange={(e) => field.handleChange(e.target.checked)}
                            />
                          )}
                          label="Equipped"
                        />
                      )}
                    </form.AppField>
                  )
                : <span />}

              <IconButton
                size="small"
                onClick={() => setOptionsOpen(true)}
                aria-label="Item options"
              >
                <RiSettings3Line size={18} />
              </IconButton>
            </Stack>

            {/* Cost + Availability */}
            <Stack direction="row" sx={{ gap: 1, alignItems: "flex-start" }}>
              <form.AppField
                name="cost"
                validators={{
                  onChange: z.number("Cost is required").min(0, "Cost must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NumberField label="Cost (¥)" size="small" sx={{ flex: 1 }} />
                )}
              </form.AppField>

              <AvailabilityFieldGroup form={form} fields="availability" />
            </Stack>

            {/* Quantity + Buy More */}
            {localOptions.multiple && (
              <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                <form.AppField
                  name="quantity"
                  validators={{
                    onChange: z
                      .number("Quantity is required")
                      .int("Quantity must be a whole number")
                      .min(1, "Quantity must be at least 1"),
                  }}
                >
                  {(field) => (
                    <field.CounterField label="Quantity" min={1} max={999} />
                  )}
                </form.AppField>

                {!isBuilder && (
                  <Button size="small" variant="outlined" onClick={() => setBuyOpen(true)}>
                    Buy More
                  </Button>
                )}
              </Stack>
            )}

            {/* Licenses section — shown when restricted/forbidden (or forced via option) */}
            {(localOptions.licenseRequired || localOptions.licenseAlwaysShow) && (
              <form.Subscribe
                selector={(state) => ({
                  restricted: state.values.availability?.restricted ?? false,
                  forbidden: state.values.availability?.forbidden ?? false,
                })}
              >
                {({ restricted, forbidden }) => {
                  if (!localOptions.licenseAlwaysShow && !restricted && !forbidden) return null

                  const sinOptions = allItems
                    .filter((g) => g.itemType === "sin")
                    .map((sin) => ({ label: sin.name, value: sin.id }))

                  return (
                    <Stack sx={{ gap: 1 }}>
                      <SectionHeader>Licenses</SectionHeader>

                      <form.AppField name="parentId">
                        {(field) => (
                          <field.SelectField
                            label="SIN"
                            size="small"
                            fullWidth
                            options={[{ label: "—", value: "" }, ...sinOptions]}
                          />
                        )}
                      </form.AppField>
                    </Stack>
                  )
                }}
              </form.Subscribe>
            )}

            {/* Attached To section */}
            {localOptions.isSubItem && (
              <Stack sx={{ gap: 1 }}>
                <SectionHeader>Attached To</SectionHeader>

                <form.AppField name="parentId">
                  {(field) => (
                    <field.SelectField
                      label="Parent Item"
                      size="small"
                      fullWidth
                      options={[{ label: "—", value: "" }, ...parentItemOptions]}
                      slotProps={{
                        select: { disabled: localOptions.fixed },
                      }}
                    />
                  )}
                </form.AppField>

                {slots?.attachmentFields?.(form)}
              </Stack>
            )}

            {/* Item-specific fields from caller */}
            {slots?.itemFields?.(form)}

            {/* Description */}
            <SectionHeader>Description</SectionHeader>

            <form.AppField name="description">
              {(field) => (
                <field.TextField
                  label="Description"
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                />
              )}
            </form.AppField>

            {/* Source */}
            <SectionHeader>Source</SectionHeader>
            <SourceFieldGroup form={form} fields={gearItemFieldMap} />

            {/* Effects */}
            {localOptions.hasEffects && (
              <GameEffectsFieldGroup form={form} fields={{ effects: "effects" }} />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ padding: 1 }}>
          {isAcquireMode
            ? (
                <form.Subscribe selector={(state) => state.values.cost}>
                  {(cost) => {
                    const safeCost = cost ?? 0
                    const canAfford = currentNuyen >= safeCost

                    const purchaseButton = (
                      <Button
                        variant="contained"
                        disabled={!canAfford}
                        onClick={() => handleSubmitWithAction("purchase")}
                      >
                        Purchase (
                        <Nuyen amount={safeCost} />
                        )
                      </Button>
                    )

                    return (
                      <>
                        <Button onClick={onClose}>Cancel</Button>

                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleSubmitWithAction("acquire")}
                        >
                          Acquire
                        </Button>

                        {canAfford
                          ? purchaseButton
                          : (
                              <Tooltip
                                title={(
                                  <>
                                    Need
                                    {" "}
                                    <Nuyen amount={safeCost} />
                                    {" "}
                                    (have
                                    {" "}
                                    <Nuyen amount={currentNuyen} />
                                    )
                                  </>
                                )}
                              >
                                <span>{purchaseButton}</span>
                              </Tooltip>
                            )}
                      </>
                    )
                  }}
                </form.Subscribe>
              )
            : (
                <>
                  <Button onClick={onClose}>Cancel</Button>

                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => handleSubmitWithAction("save")}
                  >
                    Save
                  </Button>
                </>
              )}
        </DialogActions>
      </Dialog>

      <ItemOptionsDialog
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        options={localOptions}
        forced={forced}
        onChange={setLocalOptions}
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
