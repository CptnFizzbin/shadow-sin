import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SourceData } from "#/system/sourceData.ts"
import { formatBookRef } from "#/system/sourceData.ts"

interface ItemCardSourceProps {
  source: SourceData | undefined | null
}

export const ItemCardSource: FC<ItemCardSourceProps> = ({ source }) => {
  if (!source) return null

  return (
    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", whiteSpace: "nowrap" }}>
      {formatBookRef(source)}
    </Typography>
  )
}

ItemCardSource.displayName = "ItemCard.Source"
