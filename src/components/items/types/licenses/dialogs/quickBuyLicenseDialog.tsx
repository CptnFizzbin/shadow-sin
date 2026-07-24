import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { useGearByType } from "#/components/items/gearHooks.ts"
import {
  findLicenseableSiblings,
  getLicenseCost,
  suggestLicenseRating,
} from "#/components/items/types/licenses/licenseUtils.ts"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { useIsBuilder } from "#/stores/builder/builderStore.context.ts"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { useSinFormDialog } from "./sinFormDialog.tsx"

interface QuickBuyLicenseDialogProps extends ControlledDialogProps<boolean> {
  item: ItemData
}

const QuickBuyLicenseDialog: FC<QuickBuyLicenseDialogProps> = ({ ctrl, item }) => {
  const isBuilder = useIsBuilder()
  const dispatch = useRunnerStoreDispatch()
  const sins = useGearByType<SinData>(ItemType.sin)
  const licenses = useGearByType<LicenseData>(ItemType.license)
  const allGear = useRunnerStoreSelector(Selectors.gear.selectGear)
  const currentNuyen = useRunnerStoreSelector(Selectors.nuyen.selectNuyenAmount)
  const sinFormDialog = useSinFormDialog()

  const [selectedSinId, setSelectedSinId] = useState(sins[0]?.id ?? "")
  const [rating, setRating] = useState(() => suggestLicenseRating(item.availability?.rating ?? 0))
  const [coverSiblings, setCoverSiblings] = useState(true)

  const cost = getLicenseCost(rating)
  const canAfford = currentNuyen >= cost
  const siblings = findLicenseableSiblings(item, Object.values(allGear), licenses)

  const handleCreateSin = async () => {
    const saved = await sinFormDialog.open({})
    if (!saved) return

    if (isNewItem(saved)) {
      const action = Actions.gear.addItem(saved)
      dispatch(action)
      setSelectedSinId(action.payload.id)
    } else {
      dispatch(Actions.gear.setItem(saved))
      setSelectedSinId(saved.id)
    }
  }

  const handleAcquire = () => {
    if (!selectedSinId) return

    const licenseDraft: Omit<LicenseData, "id"> = {
      itemType: ItemType.license,
      name: `License: ${item.name}`,
      rating,
      cost,
      parentId: selectedSinId as LicenseData["parentId"],
    }
    const addLicenseAction = Actions.gear.addItem(licenseDraft)
    dispatch(addLicenseAction)
    const licenseId = addLicenseAction.payload.id

    dispatch(Actions.gear.setItem({ ...item, licenseId }))
    if (coverSiblings) {
      for (const sibling of siblings) {
        dispatch(Actions.gear.setItem({ ...sibling, licenseId }))
      }
    }

    ctrl.close(true)
  }

  const handlePurchase = () => {
    if (!selectedSinId || !canAfford) return
    handleAcquire()
    dispatch(Actions.nuyen.withdrawNuyen(cost))
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>Buy License</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, padding: 1 }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Typography sx={{ flexGrow: 1 }}>{item.name}</Typography>
            {item.availability && <AvailabilityChip availability={item.availability} />}
          </Stack>

          <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
            <CounterInput
              label="Rating"
              size="small"
              value={rating}
              onChange={(value) => setRating(value ?? 1)}
              min={1}
              max={6}
            />

            <Typography color="text.secondary">
              Cost:
              {" "}
              <Nuyen amount={cost} />
            </Typography>
          </Stack>

          {siblings.length > 0 && (
            <FormControlLabel
              label={`Also cover ${siblings.length} other unlicensed "${item.name}"`}
              control={(
                <Checkbox
                  checked={coverSiblings}
                  onChange={(e) => setCoverSiblings(e.target.checked)}
                />
              )}
            />
          )}

          {sins.length === 0
            ? (
                <Stack sx={{ gap: 1 }}>
                  <Typography color="text.secondary">
                    This Runner has no SIN yet. Create one to attach the licence to.
                  </Typography>
                  <Button variant="outlined" color="secondary" onClick={handleCreateSin}>
                    Create SIN
                  </Button>
                </Stack>
              )
            : (
                <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>SIN</InputLabel>
                    <Select
                      label="SIN"
                      value={selectedSinId}
                      onChange={(e) => setSelectedSinId(e.target.value)}
                    >
                      {sins.map((sin) => (
                        <MenuItem key={sin.id} value={sin.id}>{sin.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button size="small" color="secondary" onClick={handleCreateSin}>
                    New SIN
                  </Button>
                </Stack>
              )}

          {!isBuilder && !canAfford && (
            <Typography color="error.main">
              Need
              {" "}
              <Nuyen amount={cost} />
              , have
              {" "}
              <Nuyen amount={currentNuyen} />
            </Typography>
          )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Cancel</Button>

        {isBuilder
          ? (
              <Button variant="contained" disabled={!selectedSinId} onClick={handleAcquire}>
                Add License
              </Button>
            )
          : (
              <>
                <Button variant="outlined" color="secondary" disabled={!selectedSinId} onClick={handleAcquire}>
                  Acquire
                </Button>
                <Button variant="contained" disabled={!selectedSinId || !canAfford} onClick={handlePurchase}>
                  Purchase (
                  <Nuyen amount={cost} />
                  )
                </Button>
              </>
            )}
      </Dialog.Actions>

      {sinFormDialog.dialog}
    </ControlledDialog>
  )
}

type UseQuickBuyLicenseDialogProps = Omit<QuickBuyLicenseDialogProps, keyof ControlledDialogProps<boolean>>

export const useQuickBuyLicenseDialog = () => useDialog<boolean, UseQuickBuyLicenseDialogProps>(
  (ctrl, props) => <QuickBuyLicenseDialog ctrl={ctrl} {...props} />,
)
