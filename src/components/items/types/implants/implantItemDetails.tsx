import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useImplantFormDialog } from "./dialogs/implantFormDialog.tsx"
import { getImplantEffectiveEssenceCost, getImplantEffectiveNuyenCost } from "./implantUtils.ts"

export interface ImplantItemDetailsProps {
  implant: ImplantData
  onRemoved?: () => void
  /** Called with an accessory implant when its nested subitem card is tapped, to navigate to its own details page. */
  onOpenAttachment?: (item: ItemData) => void
}

const gradeLabel: Partial<Record<string, string>> = {
  [ImplantGrade.standard]: "Standard",
  [ImplantGrade.alpha]: "Alpha",
  [ImplantGrade.beta]: "Beta",
  [ImplantGrade.delta]: "Delta",
}

const typeLabel: Partial<Record<string, string>> = {
  [ImplantType.cyberware]: "Cyberware",
  [ImplantType.bioware]: "Bioware",
}

export const ImplantItemDetails: FC<ImplantItemDetailsProps> = ({ implant, onRemoved, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
  const implantFormDialog = useImplantFormDialog()
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(implant.id))
  const effectiveEssence = getImplantEffectiveEssenceCost(implant)
  const effectiveNuyen = getImplantEffectiveNuyenCost(implant)

  const removeImplant = async () => {
    const result = await confirmDialog.confirm({
      title: <>Remove {implant.name}?</>,
      body: "Are you sure you want to remove this implant? This action cannot be undone.",
      confirmLabel: "Remove Implant",
    })
    if (result) {
      dispatch(Actions.item.removeItem({ id: implant.id, removeChildren: true }))
      onRemoved?.()
    }
  }

  const handleEdit = async () => {
    const saved = await implantFormDialog.open({ implant })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const handleAddAccessory = async () => {
    const saved = await implantFormDialog.open({ parentId: implant.id })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <>
      <ItemDetailsRoot
        item={{ ...implant, cost: effectiveNuyen }}
        type={implant.implantType ? (typeLabel[implant.implantType] ?? implant.implantType) : undefined}
        onEdit={handleEdit}
        onRemove={removeImplant}
        onAddSubitem={handleAddAccessory}
      >
        <ItemDetailsSlot.Stat label="Essence" value={effectiveEssence.toFixed(2)} type="modifier" />

        {implant.location && <ItemDetailsSlot.Stat label="Location" value={implant.location} type="rating" />}

        {implant.grade && implant.grade !== ImplantGrade.standard && (
          <ItemDetailsSlot.Stat label="Grade" value={gradeLabel[implant.grade] ?? implant.grade} type="modifier" />
        )}

        {Object.values(accessories).map((accessory) => (
          <ItemDetailsSlot.Subitem
            key={accessory.id}
            item={accessory}
            onOpen={onOpenAttachment ? () => onOpenAttachment(accessory) : undefined}
          />
        ))}
      </ItemDetailsRoot>

      {confirmDialog.dialog}
      {implantFormDialog.dialog}
    </>
  )
}
