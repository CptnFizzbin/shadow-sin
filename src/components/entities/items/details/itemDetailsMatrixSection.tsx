import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ItemMatrixStatKey } from "#/system/formulas/items/itemMatrixStats.ts"
import { itemMatrixStatKeys } from "#/system/formulas/items/itemMatrixStats.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { ItemDetailsStat } from "./itemDetails.Stat.tsx"

const statLabels: Record<ItemMatrixStatKey, string> = {
  rating: "Rating",
  response: "Response",
  system: "System",
  firewall: "Firewall",
  signal: "Signal",
}

export interface ItemDetailsMatrixSectionProps {
  itemId: UUID
  /** Rendered below the Matrix stats. */
  children?: ReactNode
}

/**
 * The item's Matrix node: its Rating and Matrix attributes, marking any that show the default
 * rather than the item's own value, and an Offline chip while its wireless is off. Renders nothing
 * when the item has no Matrix presence.
 */
export const ItemDetailsMatrixSection: FC<ItemDetailsMatrixSectionProps> = ({ itemId, children }) => {
  const matrixStats = useRunnerSelector(ItemSelectors.Matrix.selectStats, { itemId })
  if (!matrixStats) return null

  return (
    <Stack component="section" aria-label="Matrix">
      <Label sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        Matrix
        {!matrixStats.online && <Chip size="small" label="Offline" />}
      </Label>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(5, 1fr)" }, gap: 1 }}>
        {itemMatrixStatKeys.map((key) => (
          <ItemDetailsStat
            key={key}
            label={statLabels[key]}
            value={matrixStats.values[key]}
            type={key === "rating" ? "rating" : undefined}
            caption={matrixStats.defaulted.includes(key) ? "default" : undefined}
          />
        ))}
      </Box>

      {children}
    </Stack>
  )
}
