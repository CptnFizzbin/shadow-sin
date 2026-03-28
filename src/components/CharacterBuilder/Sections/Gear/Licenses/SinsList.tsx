import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { SinFormDialog } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Dialogs/SinFormDialog.tsx"
import { SinRemoveDialog } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Dialogs/SinRemoveDialog.tsx"
import type { SinFormState } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/SinFormState.ts"
import { getSinAvailability } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/SinFormState.ts"
import { LicensesList } from "#/components/CharacterBuilder/Sections/Gear/Licenses/LicensesList.tsx"
import { useSinsState } from "#/components/CharacterBuilder/Sections/Gear/Licenses/UseSinsState.ts"
import { AvailabilityChip } from "#/components/Gear/AvailabilityChip.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"

type DialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", sin: SinFormState, open: boolean }
  | { mode: "remove", sin: SinFormState, open: boolean }

export const SinsList: FC = () => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const { sins, addSin, updateSin, removeSin, getLicensesForSin } =
    useSinsState()

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const hasRealSin = sins.some((sin) => sin.rating === "real")

  const handleAddSin = (sin: SinFormState) => {
    addSin(sin)
    onDialogClose()
  }

  const handleSaveSin = (sin: SinFormState) => {
    updateSin(sin)
    onDialogClose()
  }

  const handleRemoveSin = (sin: SinFormState) => {
    removeSin(sin)
    onDialogClose()
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", open: true })}
        fullWidth
      >
        Add SIN
      </Button>

      {sins.map((sin) => {
        const sinAvail = getSinAvailability(sin.rating)
        const numLicenses = getLicensesForSin(sin.id).length

        return (
          <Box key={sin.id}>
            <Stack
              direction="column"
              sx={{
                "padding": 1,
                "borderRadius": 1,
                "border": "1px solid",
                "borderColor": "divider",
                "cursor": "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => setDialogState({ mode: "edit", sin, open: true })}
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
                      handleRemoveSin(sin)
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
                paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: 1,
                borderLeft: "8px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <LicensesList sinId={sin.id} />
            </Stack>
          </Box>
        )
      })}

      {dialogState?.mode === "create" && (
        <SinFormDialog
          open={dialogState.open}
          allowReal={!hasRealSin}
          onSave={handleAddSin}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <SinFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          onSave={handleSaveSin}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "remove" && (
        <SinRemoveDialog
          open={dialogState.open}
          sin={dialogState.sin}
          onConfirm={() => handleRemoveSin(dialogState.sin)}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
