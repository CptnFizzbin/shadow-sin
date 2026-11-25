import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { BASE_ESSENCE } from "#/rules/items/implantUtils.ts"
import { useEssenceInfo } from "#/state/runner/runnerUtils.ts"

export const CyberwareSectionHeader: FC = () => {
  const essenceInfo = useEssenceInfo()
  const isEssenceError = essenceInfo.essenceRemaining <= 0

  return (
    <Typography color={isEssenceError ? "error" : "text.secondary"}>
      {essenceInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")} / {BASE_ESSENCE} Ess
    </Typography>
  )
}
