import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ProgramData } from "#/system/gear/programData.ts"

interface ProgramDataCardProps {
  program: ProgramData
  onOpen?: () => void
  onEdit?: () => void
}

export const ProgramDataCard: FC<ProgramDataCardProps> = ({ program, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()

  const removeProgram = () => dispatch(Actions.gear.programs.destroy(program.id))

  return (
    <ItemDataCardRoot item={program} onOpen={onOpen} onEdit={onEdit} onRemove={removeProgram}>
      <DataCard.Stat value={program.programType} />
    </ItemDataCardRoot>
  )
}
