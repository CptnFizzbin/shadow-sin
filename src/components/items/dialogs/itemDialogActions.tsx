import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import type { FC } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import { selectNuyenAmount } from "#/lib/stores/runner/nuyen/nuyenSlice.selectors.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

interface ItemDialogActionsProps {
  isAcquireMode: boolean
  totalCost: number
  onClose: () => void
  onAcquire: () => void
  onPurchase: () => void
  onSave: () => void
  onDelete?: () => void
}

export const ItemDialogActions: FC<ItemDialogActionsProps> = ({
  isAcquireMode,
  totalCost,
  onClose,
  onAcquire,
  onPurchase,
  onSave,
  onDelete,
}) => {
  const currentNuyen = useRunnerStoreSelector(selectNuyenAmount)
  const canAfford = currentNuyen >= totalCost

  if (!isAcquireMode) {
    return (
      <>
        {onDelete && (
          <Button color="error" sx={{ mr: "auto" }} onClick={onDelete}>
            Delete
          </Button>
        )}

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
