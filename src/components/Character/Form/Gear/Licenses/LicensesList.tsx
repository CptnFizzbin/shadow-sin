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
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import { getLicenseAvailability } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import { useLicensesFormGroup } from "#/components/Character/Form/Gear/Licenses/UseLicensesFormGroup.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"

interface LicensesListProps {
  form: PlayerCharacterForm
  sinId: string
}

type DialogState =
  | null
  | { mode: "edit"; license: LicenseFormState; open: boolean }
  | { mode: "create"; sinId: string; open: boolean }

export const LicensesList: FC<LicensesListProps> = ({ form, sinId }) => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const { sins, getLicensesForSin, addLicense, updateLicense, removeLicense } =
    useLicensesFormGroup(form)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const licenses = getLicensesForSin(sinId)

  const handleAddLicense = (license: LicenseFormState) => {
    addLicense(license)
    onDialogClose()
  }

  const handleSaveLicense = (license: LicenseFormState) => {
    updateLicense(license)
    onDialogClose()
  }

  const handleRemoveLicense = (license: LicenseFormState) => {
    removeLicense(license)
    onDialogClose()
  }

  return (
    <>
      {licenses.map((license) => {
        const licenseAvail = getLicenseAvailability(license.rating)

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
                  <Nuyen amount={license.cost} />
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
                  label={`Rating: ${license.rating}`}
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
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", sinId, open: true })}
        fullWidth
      >
        Add License
      </Button>

      {dialogState?.mode === "create" && (
        <LicenseFormDialog
          open={dialogState.open}
          sins={sins}
          sinId={dialogState.sinId}
          onSave={handleAddLicense}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <LicenseFormDialog
          open={dialogState.open}
          sins={sins}
          license={dialogState.license}
          onSave={handleSaveLicense}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
