import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"

import type { PropsWithChildren } from "react"

export interface DiceGroup {
  name: string;
  size: number;
}

interface DicePoolCardProps {
  name: string;
  groups: DiceGroup[];
}

export function DicePools ({ children }: PropsWithChildren) {
  return (
    <Paper
      variant="outlined"
      sx={{ padding: 1, display: "flex", gap: 1, flexWrap: "wrap" }}
    >
      {children}
    </Paper>
  )
}

export function DicePoolCard ({ name, groups }: DicePoolCardProps) {
  const total = Math.max(
    0,
    groups.reduce((sum, group) => sum + group.size, 0)
  )

  return (
    <Box sx={{ display: "inline-flex", flexDirection: "column" }}>
      <DiceGroupDisplay name={name} size={total} total />
      {groups.map((group) => (
        <DiceGroupDisplay
          key={`${name}-${group.name}`}
          name={group.name}
          size={group.size}
        />
      ))}
    </Box>
  )
}

interface DiceGroupDisplayProps {
  name: string;
  size: number;
  total?: boolean;
}

function DiceGroupDisplay ({
  name,
  size,
  total = false
}: DiceGroupDisplayProps) {
  const sizeStyles = {
    display: "inline-block",
    padding: 0.5,
    width: 30,
    textAlign: "center"
  } as const

  const nameStyles = {
    display: "inline-block",
    padding: 0.5,
    marginRight: 1
  } as const

  return (
    <Box
      sx={{
        display: "flex",
        fontSize: total ? 14 : 12,
        backgroundColor: total ? "grey.900" : undefined,
        color: total ? "common.white" : "text.primary"
      }}
    >
      <Box sx={sizeStyles}>{size}</Box>
      <Box sx={nameStyles}>{name}</Box>
    </Box>
  )
}
