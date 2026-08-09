import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
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
    <ItemCard item={program} onOpen={onOpen} onEdit={onEdit} onRemove={removeProgram}>
      <ItemCard.Stat value={program.programType} />
    </ItemCard>
  )
}
