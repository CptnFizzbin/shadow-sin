import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { LicenseFormDialog } from "#/components/characterBuilder/sections/gear/licenses/dialogs/licenseFormDialog.tsx"
import { getLicenseAvailability } from "#/components/characterBuilder/sections/gear/licenses/forms/licenseUtils.ts"
import { AvailabilityChip } from "#/components/gear/availabilityChip.tsx"
import { useGearStore, useGearByType } from "#/components/gear/useGearApi.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { RatingChip } from "#/components/ui/ratingChip.tsx"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

interface LicensesListProps {
  sin: SinData
}

type DialogState =
  | null
  | { mode: "edit", license: LicenseData, open: boolean }
  | { mode: "create", open: boolean }

export const LicensesList: FC<LicensesListProps> = ({ sin }) => {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const gearApi = useGearStore()
  const licenses = useGearByType<LicenseData>(ItemType.license).filter((license) => license.parentId === sin.id)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAddLicense = (license: LicenseData) => {
    gearApi.save(license)
    onDialogClose()
  }

  const handleSaveLicense = (license: LicenseData) => {
    gearApi.save(license)
    onDialogClose()
  }

  const handleRemoveLicense = (license: LicenseData) => {
    gearApi.remove(license)
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
                "p": 1,
                "borderRadius": 1,
                "border": "1px solid",
                "borderColor": "divider",
                "cursor": "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() =>
                setDialogState({ mode: "edit", license, open: true })}
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
                <RatingChip rating={license.rating} />

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
          sin={sin}
          onSave={handleAddLicense}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <LicenseFormDialog
          open={dialogState.open}
          sin={sin}
          license={dialogState.license}
          onSave={handleSaveLicense}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
