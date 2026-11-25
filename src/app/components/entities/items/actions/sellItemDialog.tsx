import Button from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { ItemData } from "#data/items/itemData.ts"
import type { ControlledDialogProps } from "#forms/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#forms/dialog/dialog.tsx"
import { useDialog } from "#forms/dialog/useDialog.tsx"
import { formatNuyen } from "#forms/nuyen/nuyen.tsx"
import { NuyenInput } from "#forms/nuyen/nuyenInput.tsx"
import { getDefaultSalePrice, planItemSale } from "#rules/items/itemSale.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

interface SellItemDialogProps extends ControlledDialogProps<boolean> {
  item: ItemData
}

const SellItemDialog: FC<SellItemDialogProps> = ({ ctrl, item }) => {
  const dispatch = useRunnerStoreDispatch()
  const allItems = useRunnerSelector(ItemSelectors.selectAll)

  const [sellAttachments, setSellAttachments] = useState(true)
  const [salePrice, setSalePrice] = useState<number | undefined>(
    () => getDefaultSalePrice(allItems, item.id, true),
  )

  const hasRemovableAttachments = planItemSale(allItems, item.id, false).detachedIds.length > 0

  const handleSellAttachmentsChange = (checked: boolean) => {
    setSellAttachments(checked)
    setSalePrice(getDefaultSalePrice(allItems, item.id, checked))
  }

  const handleSell = () => {
    dispatch(Actions.item.sellItem({ id: item.id, salePrice: salePrice ?? 0, sellAttachments }))
    ctrl.close(true)
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs">
      <Dialog.Title>{`Sell ${item.name}`}</Dialog.Title>

      <Dialog.Content>
        <Stack>
          <NuyenInput label="Sale price" value={salePrice} onChange={setSalePrice} fullWidth autoFocus />

          {hasRemovableAttachments && (
            <Stack sx={{ gap: 0 }}>
              <FormControlLabel
                label="Sell attachments"
                control={(
                  <Switch
                    checked={sellAttachments}
                    onChange={(event) => handleSellAttachmentsChange(event.target.checked)}
                  />
                )}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {sellAttachments
                  ? "Attachments are sold with it."
                  : "Removable attachments stay in your gear. Fixed attachments are sold with it."}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close(false)}>Cancel</Button>
        <Button color="secondary" variant="contained" onClick={handleSell}>
          {`Sell for ${formatNuyen(salePrice ?? 0)}`}
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseSellItemDialogProps = Omit<SellItemDialogProps, keyof ControlledDialogProps<boolean>>

/**
 * Opens a dialog to sell an Item for an editable price, defaulting to half its cost. Resolves to
 * `true` once the Item is sold.
 */
export const useSellItemDialog = () => useDialog<boolean, UseSellItemDialogProps>(
  (ctrl, props) => <SellItemDialog ctrl={ctrl} {...props} />,
)
