import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import ListSubheader from "@mui/material/ListSubheader"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useState } from "react"

import { isItemLicensed, isLicenseQuickBuyEligible } from "#/components/items/types/licenses/licenseUtils.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useGearFilter } from "#/hooks/items/gearHooks.ts"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

interface AddCoveredItemDialogProps extends ControlledDialogProps<boolean> {
  license: LicenseData
}

export const AddCoveredItemDialog: FC<AddCoveredItemDialogProps> = ({ ctrl, license }) => {
  const dispatch = useRunnerStoreDispatch()
  const licenses = useGearFilter((item): item is LicenseData => item.itemType === ItemType.license)

  const candidates = useGearFilter((item): item is ItemData =>
    item.id !== license.id
    && item.licenseId !== license.id
    && isLicenseQuickBuyEligible(item))

  const unlicensed = candidates.filter((item) => !isItemLicensed(item, licenses))
  const licensedElsewhere = candidates.filter((item) => isItemLicensed(item, licenses))

  const [selectedItemId, setSelectedItemId] = useState(unlicensed[0]?.id ?? licensedElsewhere[0]?.id ?? "")

  // handleAdd's dispatch below moves the selected item onto this license, which drops it from
  // `candidates` (it now satisfies `item.licenseId === license.id`) a render before `ctrl.close`
  // unmounts this dialog — without a matching MenuItem for that last render, MUI logs an
  // out-of-range Select warning.
  const selectedItemStillOffered = !selectedItemId
    || unlicensed.some((item) => item.id === selectedItemId)
    || licensedElsewhere.some((item) => item.id === selectedItemId)

  const handleAdd = () => {
    if (!selectedItemId) return
    dispatch(Actions.item.licenses.setLicenseForItem({
      itemId: selectedItemId as ItemData["id"],
      licenseId: license.id,
    }))
    ctrl.close(true)
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>Add Covered Item</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, padding: 1 }}>
          {candidates.length === 0
            ? (
                <Stack sx={{ color: "text.secondary" }}>
                  No Restricted items are available to cover.
                </Stack>
              )
            : (
                <FormControl size="small" fullWidth>
                  <InputLabel>Item</InputLabel>
                  <Select
                    label="Item"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                  >
                    {!selectedItemStillOffered && <MenuItem value={selectedItemId} sx={{ display: "none" }} />}

                    {unlicensed.length > 0 && [
                      <ListSubheader key="unlicensed-header">Unlicensed</ListSubheader>,
                      ...unlicensed.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      )),
                    ]}

                    {licensedElsewhere.length > 0 && [
                      <ListSubheader key="licensed-header">Covered by another license</ListSubheader>,
                      ...licensedElsewhere.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      )),
                    ]}
                  </Select>
                </FormControl>
              )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Cancel</Button>
        <Button variant="contained" disabled={!selectedItemId} onClick={handleAdd}>
          Add
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseAddCoveredItemDialogProps = Omit<AddCoveredItemDialogProps, keyof ControlledDialogProps<boolean>>

export const useAddCoveredItemDialog = () => useDialog<boolean, UseAddCoveredItemDialogProps>(
  (ctrl, props) => <AddCoveredItemDialog ctrl={ctrl} {...props} />,
)
