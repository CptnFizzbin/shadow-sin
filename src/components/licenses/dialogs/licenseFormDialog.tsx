import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/gear/availabilityChip.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import { useItemFormSubmit } from "#/components/gear/useItemFormSubmit.ts"
import { LicenseFormFields } from "#/components/licenses/forms/licenseFormFields.tsx"
import { licenseFieldMap, useLicenseForm } from "#/components/licenses/forms/useLicenseForm.tsx"
import { getLicenseAvailability, getLicenseCost } from "#/components/licenses/licenseUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"

export interface LicenseFormDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (data: LicenseData) => void
  onDelete?: () => void
  license?: LicenseData
  sin?: SinData
}

export const LicenseFormDialog: FC<LicenseFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  onSave,
  onDelete,
  license,
  sin,
}) => {
  const title = license ? "Edit License" : "Create License"

  const { handleSubmit, isAcquireMode } = useItemFormSubmit({
    mode: license ? "edit" : "create",
    onSave,
    getItemCost: (l) => getLicenseCost(l.rating),
  })

  const form = useLicenseForm({
    license: license,
    parentId: sin?.id,
    sinReal: sin?.rating === "real" || false,
    onSubmit: handleSubmit,
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack sx={{ gap: 1, padding: 1 }}>
          <LicenseFormFields form={form} fields={licenseFieldMap} />

          <form.Subscribe selector={(state) => state.values.rating}>
            {(rating) => {
              const availability = getLicenseAvailability(rating)
              return (
                <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                  <AvailabilityChip availability={availability} />
                  {license?.source && (
                    <Chip
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                      label={`${license.source.book} p.${license.source.page}`}
                    />
                  )}
                </Stack>
              )
            }}
          </form.Subscribe>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          {onDelete && (
            <Button color="error" onClick={onDelete}>
              Delete
            </Button>
          )}
        </Box>
        {isAcquireMode
          ? (
              <form.Subscribe selector={(state) => state.values.rating}>
                {(rating) => {
                  const cost = getLicenseCost(rating)
                  return (
                    <GearAcquireActions
                      cost={cost}
                      onClose={onClose}
                      onAcquire={() => form.handleSubmit({ submitAction: "acquire" })}
                      onPurchase={() => form.handleSubmit({ submitAction: "purchase" })}
                    />
                  )
                }}
              </form.Subscribe>
            )
          : (
              <>
                <Button color="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="secondary"
                  onClick={() => form.handleSubmit()}
                  variant="contained"
                >
                  Save
                </Button>
              </>
            )}
      </DialogActions>
    </Dialog>
  )
}
