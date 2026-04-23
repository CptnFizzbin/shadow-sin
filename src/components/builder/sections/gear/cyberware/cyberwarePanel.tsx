import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useEssenceInfo } from "#/components/character/characterUtils.ts"
import { CyberwareList } from "#/components/items/types/implants/cyberwareList.tsx"
import { BASE_ESSENCE } from "#/components/items/types/implants/implantUtils.ts"

export const CyberwarePanel: FC = () => {
  const essenceInfo = useEssenceInfo()

  const essenceRemainingDisplay = essenceInfo.essenceRemaining.toFixed(2)
  const isEssenceWarning = essenceInfo.essenceRemaining <= 1
  const isEssenceError = essenceInfo.essenceRemaining <= 0

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", px: 0.5 }}
      >
        <Typography color="text.secondary">
          Essence Used: {essenceInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")}
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

      {essenceInfo.cyberwareEssence > 0 && essenceInfo.biowareEssence > 0 && (
        <Typography color="text.secondary" sx={{ px: 0.5 }}>
          Cyber: {essenceInfo.cyberwareEssence.toFixed(2)} | Bio: {essenceInfo.biowareEssence.toFixed(2)}
          (higher applied full, other at ½)
        </Typography>
      )}

      <CyberwareList />
    </Stack>
  )
}
