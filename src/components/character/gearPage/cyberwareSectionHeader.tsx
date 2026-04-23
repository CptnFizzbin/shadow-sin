import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useEssenseInfo } from "#/components/character/characterUtils.ts"
import { BASE_ESSENCE } from "#/components/implants/implantUtils.ts"

export const CyberwareSectionHeader: FC = () => {
  const essenceInfo = useEssenseInfo()
  const isEssenceError = essenceInfo.essenseRemaining <= 0

  return (
    <Typography color={isEssenceError ? "error" : "text.secondary"}>
      {essenceInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")} / {BASE_ESSENCE} Ess
    </Typography>
  )
}
