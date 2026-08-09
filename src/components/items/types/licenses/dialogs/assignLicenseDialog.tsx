import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import {
  DefaultFakeLicenseRating,
  getLicenseCost,
} from "#/components/items/types/licenses/licenseUtils.ts"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { useIsBuilder } from "#/lib/contexts/builder/builderStore.context.ts"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { useSinFormDialog } from "./sinFormDialog.tsx"

interface ExistingLicenseSectionProps {
  licenses: LicenseData[]
  sins: SinData[]
  selectedLicenseId: string
  onSelect: (licenseId: string) => void
}

const ExistingLicenseSection: FC<ExistingLicenseSectionProps> = ({
  licenses,
  sins,
  selectedLicenseId,
  onSelect,
}) => (
  <FormControl size="small" fullWidth>
    <InputLabel>License</InputLabel>
    <Select
      label="License"
      value={selectedLicenseId}
      onChange={(e) => onSelect(e.target.value)}
    >
      {licenses.map((license) => {
        const sin = sins.find((s) => s.id === license.parentId)
        return (
          <MenuItem key={license.id} value={license.id}>
            {license.name}
            {sin && ` — ${sin.name}`}
            {" "}
            (
            {license.rating === "real" ? "Real" : `Rating ${license.rating}`}
            )
          </MenuItem>
        )
      })}
    </Select>
  </FormControl>
)

interface NewLicenseSectionProps {
  sins: SinData[]
  selectedSinId: string
  onSelectSin: (sinId: string) => void
  onCreateSin: () => void
  isReal: boolean
  fakeRating: number
  onFakeRatingChange: (rating: number) => void
  cost: number
  isBuilder: boolean
  canAfford: boolean
  currentNuyen: number
}

const NewLicenseSection: FC<NewLicenseSectionProps> = ({
  sins,
  selectedSinId,
  onSelectSin,
  onCreateSin,
  isReal,
  fakeRating,
  onFakeRatingChange,
  cost,
  isBuilder,
  canAfford,
  currentNuyen,
}) => (
  <>
    {sins.length === 0
      ? (
          <Stack>
            <Typography color="text.secondary">
              This Runner has no SIN yet. Create one to attach the licence to.
            </Typography>
            <Button variant="outlined" color="secondary" onClick={onCreateSin}>
              Create SIN
            </Button>
          </Stack>
        )
      : (
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>SIN</InputLabel>
              <Select
                label="SIN"
                value={selectedSinId}
                onChange={(e) => onSelectSin(e.target.value)}
              >
                {sins.map((sin) => (
                  <MenuItem key={sin.id} value={sin.id}>{sin.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button size="small" color="secondary" onClick={onCreateSin}>
              New SIN
            </Button>
          </Stack>
        )}

    <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
      <Chip
        size="small"
        color={isReal ? "success" : "secondary"}
        label={isReal ? "Real" : "Fake"}
      />

      {!isReal && (
        <CounterInput
          label="Rating"
          size="small"
          value={fakeRating}
          onChange={(value) => onFakeRatingChange(value ?? 1)}
          min={1}
          max={6}
        />
      )}

      <Typography color="text.secondary">
        Cost:
        {" "}
        <Nuyen amount={cost} />
      </Typography>
    </Stack>

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
  </>
)

interface AssignLicenseDialogProps extends ControlledDialogProps<boolean> {
  item: ItemData
}

export const AssignLicenseDialog: FC<AssignLicenseDialogProps> = ({ ctrl, item }) => {
  const isBuilder = useIsBuilder()
  const dispatch = useRunnerStoreDispatch()
  const sins = useGearByType<SinData>(ItemType.sin)
  const licenses = useGearByType<LicenseData>(ItemType.license)
  const currentNuyen = useRunnerStoreSelector(Selectors.nuyen.selectNuyenAmount)
  const sinFormDialog = useSinFormDialog()

  const assignableLicenses = licenses.filter((license) => license.id !== item.licenseId)

  const [mode, setMode] = useState<"existing" | "new">(assignableLicenses.length > 0 ? "existing" : "new")
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>(assignableLicenses[0]?.id ?? "")
  const [selectedSinId, setSelectedSinId] = useState<string>(sins[0]?.id ?? "")
  const [fakeRating, setFakeRating] = useState(DefaultFakeLicenseRating)

  const title = item.licenseId ? "Change License" : "Assign License"

  // A Licence's reality always matches its SIN's — a Fake SIN can only carry Fake licences,
  // and only the Real SIN can carry a Real (free, unrestricted) licence.
  const selectedSin = sins.find((sin) => sin.id === selectedSinId)
  const isReal = selectedSin?.rating === "real"
  const rating: LicenseData["rating"] = isReal ? "real" : fakeRating
  const cost = getLicenseCost(rating)
  const canAfford = currentNuyen >= cost

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

  const handleAssignExisting = () => {
    if (!selectedLicenseId) return
    dispatch(Actions.gear.licenses.setLicenseForItem({
      itemId: item.id,
      licenseId: selectedLicenseId as LicenseData["id"],
    }))
    ctrl.close(true)
  }

  const handleAcquireNew = () => {
    if (!selectedSinId) return

    const licenseDraft: Omit<LicenseData, "id"> = {
      itemType: ItemType.license,
      name: `License: ${item.name}`,
      rating,
      cost,
      parentId: selectedSinId as LicenseData["parentId"],
    }
    const addLicenseAction = Actions.gear.licenses.create(licenseDraft)
    dispatch(addLicenseAction)
    dispatch(Actions.gear.licenses.setLicenseForItem({
      itemId: item.id,
      licenseId: addLicenseAction.payload.id,
    }))

    ctrl.close(true)
  }

  const handlePurchaseNew = () => {
    if (!selectedSinId || !canAfford) return
    handleAcquireNew()
    dispatch(Actions.nuyen.withdrawNuyen(cost))
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>{title}</Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, padding: 1 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Typography sx={{ flexGrow: 1 }}>{item.name}</Typography>
            {item.availability && <AvailabilityChip availability={item.availability} />}
          </Stack>

          {assignableLicenses.length > 0 && (
            <ToggleButtonGroup
              exclusive
              size="small"
              value={mode}
              onChange={(_, value: "existing" | "new" | null) => value && setMode(value)}
            >
              <ToggleButton value="existing">Existing License</ToggleButton>
              <ToggleButton value="new">New License</ToggleButton>
            </ToggleButtonGroup>
          )}

          {mode === "existing"
            ? (
                <ExistingLicenseSection
                  licenses={assignableLicenses}
                  sins={sins}
                  selectedLicenseId={selectedLicenseId}
                  onSelect={setSelectedLicenseId}
                />
              )
            : (
                <NewLicenseSection
                  sins={sins}
                  selectedSinId={selectedSinId}
                  onSelectSin={setSelectedSinId}
                  onCreateSin={handleCreateSin}
                  isReal={isReal}
                  fakeRating={fakeRating}
                  onFakeRatingChange={setFakeRating}
                  cost={cost}
                  isBuilder={isBuilder}
                  canAfford={canAfford}
                  currentNuyen={currentNuyen}
                />
              )}
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Cancel</Button>

        {mode === "existing"
          ? (
              <Button variant="contained" disabled={!selectedLicenseId} onClick={handleAssignExisting}>
                Assign
              </Button>
            )
          : isBuilder
            ? (
                <Button variant="contained" disabled={!selectedSinId} onClick={handleAcquireNew}>
                  Add License
                </Button>
              )
            : (
                <>
                  <Button variant="outlined" color="secondary" disabled={!selectedSinId} onClick={handleAcquireNew}>
                    Acquire
                  </Button>
                  <Button variant="contained" disabled={!selectedSinId || !canAfford} onClick={handlePurchaseNew}>
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

type UseAssignLicenseDialogProps = Omit<AssignLicenseDialogProps, keyof ControlledDialogProps<boolean>>

export const useAssignLicenseDialog = () => useDialog<boolean, UseAssignLicenseDialogProps>(
  (ctrl, props) => <AssignLicenseDialog ctrl={ctrl} {...props} />,
)
