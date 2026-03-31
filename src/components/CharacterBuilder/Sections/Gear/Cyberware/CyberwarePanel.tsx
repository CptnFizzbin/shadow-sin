import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useEssenseInfo } from "#/components/Character/CharacterUtils.ts"
import { CyberwareList } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/CyberwareList.tsx"
import { BASE_ESSENCE } from "#/components/Gear/ImplantUtils.ts"

export const CyberwarePanel: FC = () => {
  const essenseInfo = useEssenseInfo()

  const essenceRemainingDisplay = essenseInfo.essenseRemaining.toFixed(2)
  const isEssenceWarning = essenseInfo.essenseRemaining <= 1
  const isEssenceError = essenseInfo.essenseRemaining <= 0

  return (
    <Stack gap={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 0.5 }}
      >
        <Typography variant="caption" color="text.secondary">
          Essence Used: {essenseInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")}
        </Typography>
        <Typography
          variant="caption"
          color={
            isEssenceError
              ? "error"
              : isEssenceWarning
                ? "warning.main"
                : "text.secondary"
          }
        >
          Remaining: {essenceRemainingDisplay} / {BASE_ESSENCE}
        </Typography>
      </Stack>

      {isEssenceError && (
        <Alert severity="error" sx={{ py: 0 }}>
          Essence depleted! Implants exceed the maximum essence of {BASE_ESSENCE}.
        </Alert>
      )}

      {essenseInfo.cyberwareEssense > 0 && essenseInfo.biowareEssense > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
          Cyber: {essenseInfo.cyberwareEssense.toFixed(2)} | Bio: {essenseInfo.biowareEssense.toFixed(2)}
          (higher applied full, other at ½)
        </Typography>
      )}

      <CyberwareList />
    </Stack>
  )
}
