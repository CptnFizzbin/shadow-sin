import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { ItemList } from "#/components/entities/items/card/itemList.tsx"
import { useProgramFormDialog } from "#/components/entities/items/types/devices/dialogs/programFormDialog.tsx"
import { ProgramDataCard } from "#/components/entities/items/types/devices/programDataCard.tsx"
import { useGearListView } from "#/components/entities/items/viewer/gearListFilter.ts"
import { useGearFilter } from "#/hooks/items/gearHooks.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { isAgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import { Icons } from "#/utils/icons.ts"

import { useRunProgramDialog } from "./dialogs/runProgramDialog.tsx"

/** Plain, non-Agent Programs only — Agents get their own `MatrixAgentsSection` list instead. */
export const MatrixProgramsSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const programs = useGearFilter((item): item is ProgramData =>
    item.itemType === ItemType.program && !isAgentData(item))
  const programFormDialog = useProgramFormDialog()
  const runProgramDialog = useRunProgramDialog()
  const gearListView = useGearListView()

  const handleEdit = async (program?: ProgramData) => {
    const saved = await programFormDialog.open({ program })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  return (
    <ItemList>
      <ItemList.AddItemButton onClick={() => handleEdit()}>Add Program</ItemList.AddItemButton>

      {gearListView(programs).map((program) => (
        <ProgramDataCard
          key={program.id}
          program={program}
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: program.id } })}
          onEdit={() => handleEdit(program)}
          quickActions={[{
            label: "Run",
            icon: <Icons.item.run />,
            onClick: () => runProgramDialog.open({ program }),
          }]}
        />
      ))}

      {programFormDialog.outlet}
      {runProgramDialog.outlet}
    </ItemList>
  )
}
