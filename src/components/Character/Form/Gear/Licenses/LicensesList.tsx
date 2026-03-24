import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { LicenseFormDialog } from "#/components/Character/Form/Gear/Licenses/Dialogs/LicenseFormDialog.tsx"
import { useLicensesFormGroup } from "#/components/Character/Form/Gear/Licenses/UseLicensesFormGroup.ts"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import type { SinData } from "#/lib/system/types/gear/SinData.ts"
import type { LicenseData } from "#/lib/system/types/gear/licenseData.ts"
import { VerificationKind } from "#/lib/system/types/gear/licenseData.ts"

interface LicensesListProps {
  sin: SinData
}

type DialogState =
  | null
  | { mode: "edit"; license: LicenseData; open: boolean }
  | { mode: "create"; open: boolean }

export const LicensesList: FC<LicensesListProps> = ({ sin }) => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const { sinReal, licenses, addLicense, updateLicense, removeLicense } =
    useLicensesFormGroup(sin.id)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAddLicense = (license: LicenseData) => {
    addLicense(license)
    onDialogClose()
  }

  const handleSaveLicense = (license: LicenseData) => {
    updateLicense(license)
    onDialogClose()
  }

  const handleRemoveLicense = (license: LicenseData) => {
    removeLicense(license)
    onDialogClose()
  }

  return (
    <>
      {licenses.map((license) => {
        const licenseAvail = license.availability ?? { rating: 0 }

        return (
          <Box key={license.id}>
            <Stack
              direction="column"
              gap={0}
              sx={{
                p: 1,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() =>
                setDialogState({ mode: "edit", license, open: true })
              }
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography flexGrow={1}>{license.name}</Typography>

                <Typography>
                  <Nuyen amount={license.cost ?? 0} />
                </Typography>

                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveLicense(license)
                  }}
                >
                  <RiDeleteBin6Line size={16} />
                </IconButton>
              </Stack>

              <Stack direction="row" gap={1} sx={{ pt: 1 }}>
                <Chip
                  label={
                    license.verification.kind === VerificationKind.Real
                      ? "Real"
                      : `Rating: ${license.verification.rating}`
                  }
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />

                <AvailabilityChip availability={licenseAvail} />
              </Stack>
            </Stack>
          </Box>
        )
      })}

      <Button
        variant="text"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", open: true })}
        fullWidth
      >
        Add License
      </Button>

      {dialogState?.mode === "create" && (
        <LicenseFormDialog
          open={dialogState.open}
          sinReal={sinReal}
          onSave={handleAddLicense}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <LicenseFormDialog
          open={dialogState.open}
          license={dialogState.license}
          sinReal={sinReal}
          onSave={handleSaveLicense}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
