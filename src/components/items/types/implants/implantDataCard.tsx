import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
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
  const effectiveEssence = getImplantEffectiveEssenceCost(implant)
  const effectiveNuyen = getImplantEffectiveNuyenCost(implant)

  const removeImplant = async () => {
    const result = await confirmDialog.confirm({
      title: <>Remove {implant.name}?</>,
      body: "Are you sure you want to remove this implant? This action cannot be undone.",
      confirmLabel: "Remove Implant",
    })
    if (result) dispatch(Actions.gear.removeItem({ id: implant.id, removeChildren: true }))
  }

  return (
    <>
      <ItemDataCardRoot
        item={{ ...implant, cost: effectiveNuyen }}
        subType={implant.implantType ? (typeLabel[implant.implantType] ?? implant.implantType) : undefined}
        onOpen={onOpen}
        onEdit={onEdit}
        onRemove={removeImplant}
      >
        <DataCard.Stat label="Ess" value={effectiveEssence.toFixed(2)} type="modifier" />

        {implant.location && <DataCard.Stat value={implant.location} type="rating" />}

        {implant.grade && implant.grade !== ImplantGrade.standard && (
          <DataCard.Stat value={gradeLabel[implant.grade] ?? implant.grade} type="modifier" />
        )}

        {Object.values(accessories).map((accessory) => (
          <DataCard.Subitem key={accessory.id} name={accessory.name} />
        ))}
      </ItemDataCardRoot>

      {confirmDialog.dialog}
    </>
  )
}
