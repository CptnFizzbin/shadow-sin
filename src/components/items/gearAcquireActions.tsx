import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"

export interface GearAcquireActionsProps {
  cost: number
  onClose: () => void
  onAcquire: () => void
  onPurchase: () => void
}

export const GearAcquireActions: FC<GearAcquireActionsProps> = ({
  cost,
  onClose,
  onAcquire,
  onPurchase,
}) => {
  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const canAfford = currentNuyen >= cost

  const purchaseButton = (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      onClick={onPurchase}
      disabled={!canAfford}
    >
      Purchase ({formatNuyen(cost)})
    </Button>
  )

  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <Button onClick={onClose}>Cancel</Button>
      <Button
        type="submit"
        variant="outlined"
        color="secondary"
        onClick={onAcquire}
      >
        Acquire
      </Button>
      {canAfford
        ? purchaseButton
        : (
            <Tooltip title={`Need ${formatNuyen(cost)} (have ${formatNuyen(currentNuyen)})`}>
              <span>
                {purchaseButton}
              </span>
            </Tooltip>
          )}
    </>
  )
}
