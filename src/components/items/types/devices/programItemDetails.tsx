import type { FC } from "react"

import { BasicItemDetails } from "#/components/items/details/basicItemDetails.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ProgramData } from "#/system/gear/programData.ts"

import { useProgramFormDialog } from "./dialogs/programFormDialog.tsx"

export interface ProgramItemDetailsProps {
  program: ProgramData
  onRemoved?: () => void
}

export const ProgramItemDetails: FC<ProgramItemDetailsProps> = ({ program, onRemoved }) => {
  const dispatch = useRunnerStoreDispatch()
  const programFormDialog = useProgramFormDialog()

  const removeProgram = () => {
    dispatch(Actions.gear.programs.destroy(program.id))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await programFormDialog.open({ program })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  return (
    <>
      <BasicItemDetails item={program} onEdit={handleEdit} onRemove={removeProgram}>
        <ItemDetailsSlot.Stat label="Rating" value={program.rating} type="rating" />
        <ItemDetailsSlot.Stat label="Type" value={program.programType} />
      </BasicItemDetails>

      {programFormDialog.dialog}
    </>
  )
}
