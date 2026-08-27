import type { FC } from "react"

import { ItemDetailsRoot } from "#/components/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
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
    dispatch(Actions.item.programs.destroy(program.id))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await programFormDialog.open({ program })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <>
      <ItemDetailsRoot item={program} onEdit={handleEdit} onRemove={removeProgram}>
        <ItemDetailsSlot.Stat label="Rating" value={program.rating} type="rating" />
        <ItemDetailsSlot.Stat label="Type" value={program.programType} />
      </ItemDetailsRoot>

      {programFormDialog.outlet}
    </>
  )
}
