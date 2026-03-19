import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import { useState } from "react"
import { LicenseFormDialog } from "#/components/Character/Form/Gear/Licenses/Dialogs/LicenseFormDialog.tsx"
import {
  getLicenseAvailability,
  type LicenseFormState,
} from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

type DialogState =
  | null
  | { mode: "edit"; license: LicenseFormState; open: boolean }
  | { mode: "create"; sinId: string; open: boolean }

export const LicensesList = withFieldGroup({
  defaultValues: {
    gear: {
      sins: [] as SinFormState[],
      licenses: [] as LicenseFormState[],
    },
  },
  props: {
    sinId: "",
  },
  render: ({ group, sinId }) => {
    const [dialogState, setDialogState] = useState<DialogState>(null)

    const onDialogClose = () => {
      setDialogState((prev) => prev && { ...prev, open: false })
    }

    const onDialogClosed = () => {
      setDialogState(null)
    }

    const sins = useStore(group.store, ({ values }) => values.gear.sins)

    const licenses = useStore(
      group.store,
      ({ values }) => values.gear.licenses,
    ).filter((license) => license.sinId === sinId)

    const addLicense = (license: LicenseFormState) => {
      group.setFieldValue("gear.licenses", (prev) => [...prev, license])
      onDialogClose()
    }

    const saveLicense = (license: LicenseFormState) => {
      group.setFieldValue("gear.licenses", (prev) =>
        prev.map((l) => (l.id === license.id ? license : l)),
      )
      onDialogClose()
    }

    const removeLicense = (license: LicenseFormState) => {
      group.setFieldValue("gear.licenses", (prev) =>
        prev.filter((l) => l.id !== license.id),
      )
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
                      removeLicense(license)
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
            onSave={addLicense}
            onClose={onDialogClose}
            onClosed={onDialogClosed}
          />
        )}

        {dialogState?.mode === "edit" && (
          <LicenseFormDialog
            open={dialogState.open}
            sins={sins}
            license={dialogState.license}
            onSave={saveLicense}
            onClose={onDialogClose}
            onClosed={onDialogClosed}
          />
        )}
      </>
    )
  },
})
