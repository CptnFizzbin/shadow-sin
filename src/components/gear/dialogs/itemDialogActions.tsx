import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"

interface ItemDialogActionsProps {
  isAcquireMode: boolean
  totalCost: number
  onClose: () => void
  onAcquire: () => void
  onPurchase: () => void
  onSave: () => void
}

export const ItemDialogActions: FC<ItemDialogActionsProps> = ({
  isAcquireMode,
  totalCost,
  onClose,
  onAcquire,
  onPurchase,
  onSave,
}) => {
  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const canAfford = currentNuyen >= totalCost

  if (!isAcquireMode) {
    return (
      <>
        <Button onClick={onClose}>Cancel</Button>

        <Button type="submit" variant="contained" onClick={onSave}>
          Save
        </Button>
      </>
    )
  }

  const purchaseButton = (
    <Button variant="contained" disabled={!canAfford} onClick={onPurchase}>
      Purchase (
      <Nuyen amount={totalCost} />
      )
    </Button>
  )

  return (
    <>
      <Button onClick={onClose}>Cancel</Button>

      <Button variant="outlined" color="secondary" onClick={onAcquire}>
        Acquire
      </Button>

      {canAfford
        ? purchaseButton
        : (
            <Tooltip
              title={(
                <>
                  Need
                  {" "}
                  <Nuyen amount={totalCost} />
                  {" "}
                  (have
                  {" "}
                  <Nuyen amount={currentNuyen} />
                  )
                </>
              )}
            >
              <span>{purchaseButton}</span>
            </Tooltip>
          )}
    </>
  )
}
