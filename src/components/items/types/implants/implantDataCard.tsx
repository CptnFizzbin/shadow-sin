import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"

import { getImplantEffectiveEssenceCost, getImplantEffectiveNuyenCost } from "./implantUtils.ts"

interface ImplantDataCardProps {
  implant: ImplantData
  onOpen?: () => void
  onEdit?: () => void
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

export const ImplantDataCard: FC<ImplantDataCardProps> = ({ implant, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
  const accessories = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(implant.id))
  const hasAccessories = Object.keys(accessories).length > 0
  const effectiveEssence = getImplantEffectiveEssenceCost(implant)
  const effectiveNuyen = getImplantEffectiveNuyenCost(implant)

  const removeImplant = async () => {
    const result = await confirmDialog.confirm({
      title: <>Remove {implant.name}?</>,
      body: "Are you sure you want to remove this implant? This action cannot be undone.",
      confirmLabel: "Remove Implant",
    })
    if (result) dispatch(Actions.item.removeItem({ id: implant.id, removeChildren: true }))
  }

  return (
    <>
      <ItemCard
        item={implant}
        costEffectiveValue={effectiveNuyen}
        onOpen={onOpen}
        onEdit={onEdit}
        onRemove={removeImplant}
      >
        {implant.implantType && <ItemCard.SubType label={typeLabel[implant.implantType] ?? implant.implantType} />}

        <ItemCard.Stat
          label="Ess"
          value={implant.essenceCost.toFixed(2)}
          effectiveValue={effectiveEssence.toFixed(2)}
          type="modifier"
        />

        {implant.location && <ItemCard.Stat value={implant.location} type="rating" />}

        {implant.grade && implant.grade !== ImplantGrade.standard && (
          <ItemCard.Stat value={gradeLabel[implant.grade] ?? implant.grade} type="modifier" />
        )}

        {hasAccessories && (
          <ItemCard.Layout.BodyRow
            direction="column"
            sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
          >
            {Object.values(accessories).map((accessory) => (
              <ItemCard.Subitem key={accessory.id} name={accessory.name} />
            ))}
          </ItemCard.Layout.BodyRow>
        )}
      </ItemCard>

      {confirmDialog.dialog}
    </>
  )
}
