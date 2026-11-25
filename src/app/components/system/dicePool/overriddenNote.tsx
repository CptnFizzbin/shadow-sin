import Box from "@mui/material/Box"
import type { FC } from "react"

import type { OverrideReason } from "#/rules/gameEffects/effectTagStacking.ts"

/** Why an overridden dice group or Modifier doesn't count, in on-screen words. */
export function describeOverride({ name, value, tag }: OverrideReason): string {
  return `Overridden by ${name} (${value}): effects tagged "${tag}" don't stack, and only the highest applies.`
}

/** Struck through and dimmed: a row that's listed, but not counted toward the total. */
export const overriddenSx = { textDecoration: "line-through", color: "text.disabled" } as const

/**
 * The override reason for screen readers, placed inside the struck-through row. Sighted Players get
 * the same text from its `OverrideTooltip`.
 */
export const OverriddenNote: FC<{ reason: OverrideReason }> = ({ reason }) => (
  <Box
    component="span"
    sx={{
      position: "absolute",
      width: 1,
      height: 1,
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      whiteSpace: "nowrap",
    }}
  >
    {describeOverride(reason)}
  </Box>
)
