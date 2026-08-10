import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useAddCoveredItemDialog } from "./dialogs/addCoveredItemDialog.tsx"

interface LicenseCoveredItemsSectionProps {
  license: LicenseData
}

/**
 * Renders the covered-items section of a Licence's own edit form: the gear items this
 * Licence currently covers, with the ability to add another covered item or unlink one.
 */
export const LicenseCoveredItemsSection: FC<LicenseCoveredItemsSectionProps> = ({ license }) => {
  const dispatch = useRunnerStoreDispatch()
  const coveredItems = useRunnerStoreSelector(Selectors.gear.licenses.selectItemsForId(license.id))
  const addCoveredItemDialog = useAddCoveredItemDialog()

  const handleRemove = (itemId: ItemData["id"]) => {
    dispatch(Actions.item.licenses.clearLicenseForItem({ itemId }))
  }

  return (
    <Stack>
      <Label label="Covered Items" />

      {coveredItems.length === 0 && (
        <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
          This license doesn't cover any items yet.
        </Typography>
      )}

      {coveredItems.map((item: ItemData) => (
        <Stack key={item.id} direction="row" sx={{ alignItems: "center" }}>
          <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>{item.name}</Typography>
          <IconButton size="small" color="error" aria-label="Remove" onClick={() => handleRemove(item.id)}>
            <RiDeleteBin6Line size={16} />
          </IconButton>
        </Stack>
      ))}

      <Button
        variant="text"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => addCoveredItemDialog.open({ license })}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Item
      </Button>

      {addCoveredItemDialog.dialog}
    </Stack>
  )
}
