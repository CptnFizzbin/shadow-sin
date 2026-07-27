import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { RatingChip } from "#/components/ui/ratingChip.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useIsBuilder } from "#/lib/contexts/builder/builderStore.context.ts"
import type { AnyItemForm, ItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useAssignLicenseDialog } from "./dialogs/assignLicenseDialog.tsx"
import { isLicenseQuickBuyEligible } from "./licenseUtils.ts"

const GearFormLicenseSectionContent: FC<{ item: ItemData }> = ({ item }) => {
  const isBuilder = useIsBuilder()
  const dispatch = useRunnerStoreDispatch()
  // Read live from the store rather than the form's own (possibly stale) draft values,
  // since assigning/changing/removing a license dispatches directly to the gear store
  // without going through this form's own submit.
  const license = useRunnerStoreSelector(Selectors.gear.licenses.selectForItem(item.id))
  const assignLicenseDialog = useAssignLicenseDialog()

  const eligible = item.id !== NullUuid && isLicenseQuickBuyEligible(item)
  if (!eligible && !license) return null

  const handleRemove = () => {
    dispatch(Actions.gear.licenses.clearLicenseForItem({ itemId: item.id }))
  }

  const openAssignDialog = () => assignLicenseDialog.open({ item: { ...item, licenseId: license?.id } })

  return (
    <Stack sx={{ gap: 1 }}>
      <Label label="License" />

      {license
        ? (
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
              <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>{license.name}</Typography>
              <RatingChip rating={license.rating} />
              <Button size="small" onClick={openAssignDialog}>
                Change
              </Button>
              <Button size="small" color="error" onClick={handleRemove}>
                Remove
              </Button>
            </Stack>
          )
        : (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={openAssignDialog}
              sx={{ alignSelf: "flex-start" }}
            >
              {isBuilder ? "Add License" : "Acquire / Purchase License"}
            </Button>
          )}

      {assignLicenseDialog.dialog}
    </Stack>
  )
}

interface GearFormLicenseSectionProps {
  form: AnyItemForm
}

/**
 * Renders the license section of a gear item's own edit form: for a Restricted,
 * unlicensed item it offers to assign a license; for an already-licensed item it shows
 * the covering license and lets the Player change or remove it. Renders nothing for an
 * item that hasn't been saved yet — a licence can only be assigned to gear that already
 * exists in the runner's gear. Subscribes to the form's own values so the section reacts
 * live as the Player edits availability (e.g. toggling Restricted on or off).
 */
export const GearFormLicenseSection: FC<GearFormLicenseSectionProps> = ({ form: formArg }) => {
  const form = formArg as ItemForm

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => <GearFormLicenseSectionContent item={values} />}
    </form.Subscribe>
  )
}
