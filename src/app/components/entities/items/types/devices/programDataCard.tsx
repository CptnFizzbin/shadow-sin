import type { FC } from "react"

import type { EntityCardLeftAction } from "#app/components/ui/cards/entityCard/entityCard.tsx"
import { ItemCard } from "#app/components/ui/cards/itemCard/itemCard.tsx"
import type { ProgramData } from "#data/items/programData.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"

interface ProgramDataCardProps {
  program: ProgramData
  onOpen?: () => void
  onEdit?: () => void
  leftAction?: EntityCardLeftAction
}

export const ProgramDataCard: FC<ProgramDataCardProps> = ({ program, onOpen, onEdit, leftAction }) => {
  const dispatch = useRunnerStoreDispatch()

  const removeProgram = () => dispatch(Actions.item.programs.destroy(program.id))

  return (
    <ItemCard item={program} onOpen={onOpen} onEdit={onEdit} onRemove={removeProgram} leftAction={leftAction}>
      <ItemCard.Stat value={program.programType} />
    </ItemCard>
  )
}
