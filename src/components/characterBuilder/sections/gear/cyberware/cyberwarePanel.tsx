import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useEssenseInfo } from "#/components/character/characterUtils.ts"
import { CyberwareList } from "#/components/characterBuilder/sections/gear/cyberware/cyberwareList.tsx"
import { BASE_ESSENCE } from "#/components/gear/implantUtils.ts"

export const CyberwarePanel: FC = () => {
  const essenseInfo = useEssenseInfo()

  const essenceRemainingDisplay = essenseInfo.essenseRemaining.toFixed(2)
  const isEssenceWarning = essenseInfo.essenseRemaining <= 1
  const isEssenceError = essenseInfo.essenseRemaining <= 0

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", px: 0.5 }}
      >
        <Typography color="text.secondary">
          Essence Used: {essenseInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")}
        </Typography>
        <Typography

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
        <Typography color="text.secondary" sx={{ px: 0.5 }}>
          Cyber: {essenseInfo.cyberwareEssense.toFixed(2)} | Bio: {essenseInfo.biowareEssense.toFixed(2)}
          (higher applied full, other at ½)
        </Typography>
      )}

      <CyberwareList />
    </Stack>
  )
}
