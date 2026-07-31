import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { ProgramData } from "#/system/gear/programData.ts"

interface ProgramItemCardProps {
  program: ProgramData
  onOpen?: () => void
}

export const ProgramItemCard: FC<ProgramItemCardProps> = ({ program, onOpen }) => {
  const dispatch = useRunnerStoreDispatch()

  const removeProgram = () => dispatch(Actions.gear.programs.destroy(program.id))

  return (
    <BasicItemCard item={program} onOpen={onOpen} onRemove={removeProgram}>
      <ItemCardSlot.Stat label="Rating" value={program.rating} type="rating" />
      <ItemCardSlot.Stat value={program.programType} />

      {program.cost !== undefined && (
        <ItemCardSlot.Footer>
          <Nuyen amount={program.cost} />
        </ItemCardSlot.Footer>
      )}
    </BasicItemCard>
  )
}
