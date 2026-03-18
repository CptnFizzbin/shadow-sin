import Box from "@mui/material/Box"
import type { FC } from "react"

export interface DiceGroup {
  name: string
  size: number
  color?: string
}

interface DicePoolProps {
  name: string
  groups: (DiceGroup | null | boolean)[]
}

export const DicePool: FC<DicePoolProps> = ({ name, groups }) => {
  const diceGroups = groups.filter(
    (group): group is DiceGroup =>
      typeof group === "object" &&
      group !== null &&
      "name" in group &&
      "size" in group,
  )

  const total = Math.max(
    0,
    diceGroups.reduce((sum, group) => sum + group.size, 0),
  )

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <DiceGroupDisplay name={name} size={total} total />

      {diceGroups.map((group) => (
        <DiceGroupDisplay
          key={`${name}-${group.name}`}
          name={group.name}
          size={group.size}
          color={group.color}
        />
      ))}
    </Box>
  )
}

interface DiceGroupDisplayProps {
  name: string
  size: number
  total?: boolean
  color?: string
}

function DiceGroupDisplay({
  name,
  size,
  total = false,
  color = "text.primary",
}: DiceGroupDisplayProps) {
  const sizeStyles = {
    display: "inline-block",
    padding: 0.5,
    width: 30,
    textAlign: "center",
  } as const

  const nameStyles = {
    display: "inline-block",
    padding: 0.5,
    marginRight: 1,
  } as const

  return (
    <Box
      sx={{
        display: "flex",
        fontSize: total ? 14 : 12,
        backgroundColor: total ? "grey.900" : undefined,
        color: color,
      }}
    >
      <Box sx={sizeStyles}>{size}</Box>
      <Box sx={nameStyles}>{name}</Box>
    </Box>
  )
}
