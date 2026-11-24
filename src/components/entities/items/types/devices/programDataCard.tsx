import type { FC } from "react"

import type { EntityCardQuickAction } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { ItemCard } from "#/components/ui/cards/itemCard/itemCard.tsx"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"

interface ProgramDataCardProps {
  program: ProgramData
  onOpen?: () => void
  onEdit?: () => void
  quickActions?: EntityCardQuickAction[]
}

export const ProgramDataCard: FC<ProgramDataCardProps> = ({ program, onOpen, onEdit, quickActions }) => {
  const dispatch = useRunnerStoreDispatch()

  const removeProgram = () => dispatch(Actions.item.programs.destroy(program.id))

  return (
    <ItemCard item={program} onOpen={onOpen} onEdit={onEdit} onRemove={removeProgram} quickActions={quickActions}>
      <ItemCard.Stat value={program.programType} />
    </ItemCard>
  )
}
