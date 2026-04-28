import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

interface DiceGroupDisplayProps {
  name: string
  size: number
  total?: boolean
  color?: string
  onClick?: () => void
}

export function DiceGroupDisplay({
  name,
  size,
  total = false,
  color,
  onClick,
}: DiceGroupDisplayProps) {
  return (
    <Stack
      component={onClick ? "button" : "div"}
      direction="row"
      onClick={onClick}
      sx={{
        alignItems: "flex-start",
        gap: 1,
        paddingX: 1,
        backgroundColor: total ? "primary.dark" : undefined,
        color: color ?? (total ? "primary.contrastText" : undefined),
        fontWeight: total ? "bold" : "normal",
        width: "100%",
        border: "none",
        textAlign: "left",
        ...(onClick && {
          "cursor": "pointer",
          "&:hover": { filter: "brightness(1.15)" },
        }),
      }}
    >
      <Typography sx={{ flexGrow: 1 }}>
        {name}
      </Typography>
      <Typography sx={{ display: "flex", width: "2em", justifyContent: "flex-end" }}>
        {size}
      </Typography>
    </Stack>
  )
}
