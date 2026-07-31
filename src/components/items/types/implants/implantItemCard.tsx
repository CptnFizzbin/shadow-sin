import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"

import { getImplantEffectiveEssenceCost, getImplantEffectiveNuyenCost } from "./implantUtils.ts"

interface ImplantItemCardProps {
  implant: ImplantData
  onOpen?: () => void
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

export const ImplantItemCard: FC<ImplantItemCardProps> = ({ implant, onOpen }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
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
      <BasicItemCard
        item={implant}
        type={implant.implantType ? (typeLabel[implant.implantType] ?? implant.implantType) : undefined}
        onOpen={onOpen}
        onRemove={removeImplant}
      >
        <ItemCardSlot.Stat label="Ess" value={effectiveEssence.toFixed(2)} type="modifier" />

        {implant.location && <ItemCardSlot.Stat value={implant.location} type="rating" />}

        {implant.grade && implant.grade !== ImplantGrade.standard && (
          <ItemCardSlot.Stat value={gradeLabel[implant.grade] ?? implant.grade} type="modifier" />
        )}

        <ItemCardSlot.Footer>
          <Nuyen amount={effectiveNuyen} />
        </ItemCardSlot.Footer>
      </BasicItemCard>

      {confirmDialog.dialog}
    </>
  )
}
