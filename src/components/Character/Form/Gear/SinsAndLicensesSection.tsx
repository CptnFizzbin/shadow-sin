import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line, RiEditLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"
import { LicenseEditDialog } from "#/components/Character/Form/Gear/LicenseEditDialog.tsx"
import { SinEditDialog } from "#/components/Character/Form/Gear/SinEditDialog.tsx"
import {
  computeLicenseAvailability,
  computeLicenseNuyen,
  computeSinAvailability,
  computeSinNuyen,
  formatNuyen,
  useGearFormGroup,
} from "#/components/Character/Form/Gear/UseGearFormGroup.ts"
import type {
  LicenseFormItem,
  PlayerCharacterForm,
  SinFormItem,
} from "#/components/Character/Form/UseCharacterForm.ts"

interface SinsAndLicensesSectionProps {
  form: PlayerCharacterForm
}

type DialogState =
  | { type: "add-sin" }
  | { type: "edit-sin"; sin: SinFormItem }
  | { type: "add-license"; sinId: string }
  | { type: "edit-license"; license: LicenseFormItem }
  | null

export const SinsAndLicensesSection: FC<SinsAndLicensesSectionProps> = ({
  form,
}) => {
  const {
    sins,
    licenses,
    hasRealSin,
    addSin,
    updateSin,
    removeSin,
    addLicense,
    updateLicense,
    removeLicense,
  } = useGearFormGroup(form)

  const [dialogState, setDialogState] = useState<DialogState>(null)

  const licensesForSin = (sinId: string) =>
    licenses.filter((lic) => lic.sinId === sinId)

  const handleSinSave = (sinData: Omit<SinFormItem, "id">) => {
    if (dialogState?.type === "edit-sin") {
      updateSin(dialogState.sin.id, sinData)
    } else {
      addSin(sinData)
    }
  }

  const handleLicenseSave = (licenseData: Omit<LicenseFormItem, "id">) => {
    if (dialogState?.type === "edit-license") {
      updateLicense(dialogState.license.id, licenseData)
    } else {
      addLicense(licenseData)
    }
  }

  const canAddRealSin =
    !hasRealSin ||
    (dialogState?.type === "edit-sin" && dialogState.sin.kind === "real")

  return (
    <Stack gap={1}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={16} />}
        onClick={() => setDialogState({ type: "add-sin" })}
        sx={{ alignSelf: "flex-start" }}
      >
        Add SIN
      </Button>

      <Stack gap={0.5}>
        {sins.map((sin) => (
          <Box key={sin.id}>
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => setDialogState({ type: "edit-sin", sin })}
            >
              <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
                {sin.name}
              </Typography>
              <Typography
                sx={{ width: 32, textAlign: "right", fontSize: "0.875rem" }}
              >
                {sin.kind === "real" ? "R" : sin.rating}
              </Typography>
              <Typography
                sx={{ width: 48, textAlign: "right", fontSize: "0.875rem" }}
              >
                {computeSinAvailability(sin)}
              </Typography>
              <Typography
                sx={{ width: 72, textAlign: "right", fontSize: "0.875rem" }}
              >
                {sin.kind === "real" ? "-" : formatNuyen(computeSinNuyen(sin))}
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation()
                  removeSin(sin.id)
                }}
                aria-label={`Remove ${sin.name}`}
              >
                <RiDeleteBin6Line size={16} />
              </IconButton>
            </Stack>

            <Stack gap={0.5} sx={{ pl: 3, pt: 0.5 }}>
              {licensesForSin(sin.id).map((license) => (
                <Stack
                  key={license.id}
                  direction="row"
                  alignItems="center"
                  gap={0.5}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() =>
                    setDialogState({ type: "edit-license", license })
                  }
                >
                  <RiEditLine size={14} style={{ opacity: 0.4 }} />
                  <Typography sx={{ flexGrow: 1, fontSize: "0.8125rem" }}>
                    {license.name}
                  </Typography>
                  <Typography
                    sx={{
                      width: 32,
                      textAlign: "right",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {sin.kind === "real" ? "-" : license.rating}
                  </Typography>
                  <Typography
                    sx={{
                      width: 48,
                      textAlign: "right",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {computeLicenseAvailability(license, sins)}
                  </Typography>
                  <Typography
                    sx={{
                      width: 72,
                      textAlign: "right",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {formatNuyen(computeLicenseNuyen(license, sins))}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeLicense(license.id)
                    }}
                    aria-label={`Remove ${license.name}`}
                  >
                    <RiDeleteBin6Line size={16} />
                  </IconButton>
                </Stack>
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={14} />}
                onClick={() =>
                  setDialogState({ type: "add-license", sinId: sin.id })
                }
                sx={{ alignSelf: "flex-start", fontSize: "0.8125rem" }}
              >
                Add License
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>

      <SinEditDialog
        key={
          dialogState?.type === "edit-sin"
            ? `edit-sin-${dialogState.sin.id}`
            : "add-sin"
        }
        open={
          dialogState?.type === "add-sin" || dialogState?.type === "edit-sin"
        }
        onClose={() => setDialogState(null)}
        onSave={handleSinSave}
        initialValues={
          dialogState?.type === "edit-sin" ? dialogState.sin : undefined
        }
        canAddRealSin={canAddRealSin}
      />

      <LicenseEditDialog
        key={
          dialogState?.type === "edit-license"
            ? `edit-license-${dialogState.license.id}`
            : dialogState?.type === "add-license"
              ? `add-license-${dialogState.sinId}`
              : "add-license"
        }
        open={
          dialogState?.type === "add-license" ||
          dialogState?.type === "edit-license"
        }
        onClose={() => setDialogState(null)}
        onSave={handleLicenseSave}
        initialValues={
          dialogState?.type === "edit-license" ? dialogState.license : undefined
        }
        sins={sins}
        defaultSinId={
          dialogState?.type === "add-license" ? dialogState.sinId : undefined
        }
      />
    </Stack>
  )
}
