import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import { useState } from "react"
import { SinFormDialog } from "#/components/Character/Form/Gear/Licenses/Dialogs/SinFormDialog.tsx"
import { SinRemoveDialog } from "#/components/Character/Form/Gear/Licenses/Dialogs/SinRemoveDialog.tsx"
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import {
  getSinAvailability,
  type SinFormState,
} from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"
import { LicensesList } from "#/components/Character/Form/Gear/Licenses/LicensesList.tsx"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm.ts"

type DialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; sin: SinFormState; open: boolean }
  | { mode: "remove"; sin: SinFormState; open: boolean }

export const SinsList = withFieldGroup({
  defaultValues: {
    gear: {
      sins: [] as SinFormState[],
      licenses: [] as LicenseFormState[],
    },
  },
  render: ({ group }) => {
    const [dialogState, setDialogState] = useState<DialogState>(null)

    const onDialogClose = () => {
      setDialogState((prev) => prev && { ...prev, open: false })
    }

    const onDialogClosed = () => {
      setDialogState(null)
    }

    const sins = useStore(group.store, ({ values }) => values.gear.sins)
    const hasRealSin = sins.some((sin) => sin.rating === "real")

    const addSin = (sin: SinFormState) => {
      group.setFieldValue("gear.sins", (prev) => [...prev, sin])
      onDialogClose()
    }

    const saveSin = (sin: SinFormState) => {
      group.setFieldValue("gear.sins", (prev) =>
        prev.map((item) => (item.id === sin.id ? sin : item)),
      )
      onDialogClose()
    }

    const removeSin = (sin: SinFormState) => {
      group.setFieldValue("gear.sins", (prev) =>
        prev.filter((item) => item.id !== sin.id),
      )
      group.setFieldValue("gear.licenses", (prev) =>
        prev.filter((item) => item.sinId !== sin.id),
      )
      onDialogClose()
    }

    return (
      <>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RiAddLine size={14} />}
          onClick={() => setDialogState({ mode: "create", open: true })}
          fullWidth
        >
          Add SIN
        </Button>

        {sins.map((sin) => {
          const sinAvail = getSinAvailability(sin.rating)

          const numLicenses = group
            .getFieldValue("gear.licenses")
            .filter((license) => license.sinId === sin.id).length

          return (
            <Box key={sin.id}>
              <Stack
                direction="column"
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() =>
                  setDialogState({ mode: "edit", sin, open: true })
                }
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
                    {sin.name}
                  </Typography>

                  <Typography>
                    <Nuyen amount={sin.cost} />
                  </Typography>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (numLicenses >= 1) {
                        setDialogState({ mode: "remove", sin, open: true })
                      } else {
                        removeSin(sin)
                      }
                    }}
                  >
                    <RiDeleteBin6Line size={16} />
                  </IconButton>
                </Stack>

                <Stack direction="row" gap={1} sx={{ pt: 1 }}>
                  <Chip
                    label={
                      sin.rating === "real" ? "Real" : `Rating: ${sin.rating}`
                    }
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />

                  <AvailabilityChip availability={sinAvail} />
                </Stack>
              </Stack>

              <Stack
                gap={1}
                sx={{
                  padding: 1,
                  borderLeft: "8px solid",
                  borderColor: "divider",
                }}
              >
                <LicensesList
                  form={group}
                  sinId={sin.id}
                  fields={{
                    gear: "gear",
                  }}
                />
              </Stack>
            </Box>
          )
        })}

        {dialogState?.mode === "create" && (
          <SinFormDialog
            open={dialogState.open}
            allowReal={!hasRealSin}
            onSave={addSin}
            onClose={onDialogClose}
            onClosed={onDialogClosed}
          />
        )}

        {dialogState?.mode === "edit" && (
          <SinFormDialog
            open={dialogState.open}
            sin={dialogState.sin}
            onSave={saveSin}
            onClose={onDialogClose}
            onClosed={onDialogClosed}
          />
        )}

        {dialogState?.mode === "remove" && (
          <SinRemoveDialog
            open={dialogState.open}
            sin={dialogState.sin}
            onConfirm={() => removeSin(dialogState.sin)}
            onClose={onDialogClose}
            onClosed={onDialogClosed}
          />
        )}
      </>
    )
  },
})
