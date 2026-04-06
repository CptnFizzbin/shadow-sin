import Box from "@mui/material/Box"

interface DiceGroupDisplayProps {
  name: string
  size: number
  total?: boolean
  color?: string
}

export function DiceGroupDisplay({
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
