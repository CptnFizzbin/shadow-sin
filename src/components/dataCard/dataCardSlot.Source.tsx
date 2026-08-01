import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SourceData } from "#/system/sourceData.ts"
import { formatBookRef } from "#/system/sourceData.ts"

interface DataCardSourceProps {
  source: SourceData | undefined | null
}

export const DataCardSlotSource: FC<DataCardSourceProps> = ({ source }) => {
  if (!source) return null

  return (
    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", whiteSpace: "nowrap" }}>
      {formatBookRef(source)}
    </Typography>
  )
}

DataCardSlotSource.displayName = "DataCard.Source"
