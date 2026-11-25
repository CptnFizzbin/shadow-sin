import Chip from "@mui/material/Chip"
import type { FC } from "react"

import type { SourceData } from "#/data/source/sourceData.ts"
import { formatBookRef } from "#/data/source/sourceData.ts"

export interface ItemDetailsSourceProps {
  source: SourceData | undefined | null
}

/** Overrides `item.source` in the meta line `ItemDetailsRoot` renders by default. */
export const ItemDetailsSource: FC<ItemDetailsSourceProps> = ({ source }) => {
  if (!source) return null

  return (
    <Chip size="small" label={formatBookRef(source)} />
  )
}

ItemDetailsSource.displayName = "ItemDetails.Source"
