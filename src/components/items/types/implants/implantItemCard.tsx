import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import type { ItemCardProps } from "#/components/items/card/itemCard.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { GearMaxAvailability } from "#/components/items/gearUtils.ts"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"

import { useImplantFormDialog } from "./dialogs/implantFormDialog.tsx"
import { getImplantEffectiveEssenceCost, getImplantEffectiveNuyenCost } from "./implantUtils.ts"

interface ImplantItemCardProps extends Omit<ItemCardProps, "children"> {
  implant: ImplantData
  onAddAccessory?: () => void
  accessories?: ImplantData[]
}

const gradeLabel: Partial<Record<string, string>> = {
  [ImplantGrade.standard]: "Std",
  [ImplantGrade.alpha]: "Alpha",
  [ImplantGrade.beta]: "Beta",
  [ImplantGrade.delta]: "Delta",
}

const typeLabel: Partial<Record<string, string>> = {
  [ImplantType.cyberware]: "Cyber",
  [ImplantType.bioware]: "Bio",
}

export const ImplantItemCard: FC<ImplantItemCardProps> = ({
  implant,
  onAddAccessory,
  accessories = [],
  ...props
}) => {
  const { availability, source } = implant
  const effectiveNuyen = getImplantEffectiveNuyenCost(implant)
  const effectiveEssence = getImplantEffectiveEssenceCost(implant)
  const implantFormDialog = useImplantFormDialog()
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()

  const handleRemove = async () => {
    const result = await confirmDialog.confirm({
      title: <>Remove {implant.name}?</>,
      body: "Are you sure you want to remove this implant? This action cannot be undone.",
      confirmLabel: "Remove Implant",
    })
    if (result) dispatch(Actions.gear.removeItem({ id: implant.id }))
  }

  const handleEdit = async () => {
    const saved = await implantFormDialog.open({ implant, parentId: implant.parentId })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <ItemCard onClick={handleEdit} {...props}>
        <ItemCard.Title>{implant.name}</ItemCard.Title>

        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            {effectiveEssence.toFixed(2)} Ess
          </Typography>
        </ItemCard.Meta>

        <ItemCard.Meta type="cost">
          <Typography sx={{ fontSize: "0.875rem" }}>
            <Nuyen amount={effectiveNuyen} />
          </Typography>
        </ItemCard.Meta>

        {implant.implantType && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label={typeLabel[implant.implantType] ?? implant.implantType} />
          </ItemCard.Meta>
        )}

        {implant.location && (
          <ItemCard.Meta type="stat">
            <ItemStatChip label={implant.location} />
          </ItemCard.Meta>
        )}

        {implant.grade && implant.grade !== ImplantGrade.standard && (
          <ItemCard.Meta type="stat">
            <ItemStatChip
              label={gradeLabel[implant.grade] ?? implant.grade}
              color="secondary"
            />
          </ItemCard.Meta>
        )}

        {availability && (
          <ItemCard.Meta type="stat">
            <AvailabilityChip
              availability={availability}
              color={
                availability.rating > GearMaxAvailability ? "warning" : undefined
              }
            />
          </ItemCard.Meta>
        )}

        {source && (
          <ItemCard.Meta type="source">
            <ItemStatChip label={`${source.book} p.${source.page}`} />
          </ItemCard.Meta>
        )}

        <ItemCard.Action type="icon" color="error" onClick={handleRemove}>
          <RiDeleteBin6Line size={16} />
        </ItemCard.Action>

        {onAddAccessory && (
          <ItemCard.AddChildButton onClick={onAddAccessory}>
            Add Accessory
          </ItemCard.AddChildButton>
        )}

        {accessories.length > 0 && (
          <ItemCard.Children>
            {accessories.map((accessory) => (
              <ImplantItemCard key={accessory.id} implant={accessory} variant="borderless" />
            ))}
          </ItemCard.Children>
        )}
      </ItemCard>

      {implantFormDialog.dialog}
      {confirmDialog.dialog}
    </>
  )
}
