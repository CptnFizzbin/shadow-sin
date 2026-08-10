import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { useProgramFormDialog } from "#/components/items/types/devices/dialogs/programFormDialog.tsx"
import { ProgramDataCard } from "#/components/items/types/devices/programDataCard.tsx"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

export const MatrixProgramsSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const programs = useGearByType<ProgramData>(ItemType.program)
  const programFormDialog = useProgramFormDialog()

  const handleEdit = async (program?: ProgramData) => {
    const saved = await programFormDialog.open({ program })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <ItemList>
      <ItemList.AddItemButton onClick={() => handleEdit()}>Add Program</ItemList.AddItemButton>

      {programs.map((program) => (
        <ProgramDataCard
          key={program.id}
          program={program}
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: program.id } })}
          onEdit={() => handleEdit(program)}
        />
      ))}

      {programFormDialog.dialog}
    </ItemList>
  )
}
