import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { BASE_ESSENCE } from "#/components/items/types/implants/implantUtils.ts"
import { useEssenceInfo } from "#/components/runner/runnerUtils.ts"

export const CyberwareSectionHeader: FC = () => {
  const essenceInfo = useEssenceInfo()
  const isEssenceError = essenceInfo.essenceRemaining <= 0

  return (
    <Typography color={isEssenceError ? "error" : "text.secondary"}>
      {essenceInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")} / {BASE_ESSENCE} Ess
    </Typography>
  )
}
