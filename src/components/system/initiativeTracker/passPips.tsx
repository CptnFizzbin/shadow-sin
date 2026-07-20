import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import type { FC, MouseEvent } from "react"

interface PassPipsProps {
  total: number
  completed: number[]
  onToggle?: (passIndex: number) => void
}

export const PassPips: FC<PassPipsProps> = ({ total, completed, onToggle }) => (
  <Stack direction="row" sx={{ gap: 0.5 }}>
    {Array.from({ length: total }, (_, passIndex) => {
      const done = completed.includes(passIndex)
      return (
        <Box
          key={passIndex}
          component={onToggle ? "button" : "div"}
          onClick={onToggle
            ? (event: MouseEvent) => {
                event.stopPropagation()
                onToggle(passIndex)
              }
            : undefined}
          sx={{
            "width": 22,
            "height": 22,
            "padding": 0,
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "fontSize": "0.7rem",
            "fontWeight": "bold",
            "border": "1px solid",
            "borderColor": done ? "secondary.main" : "divider",
            "backgroundColor": done ? "secondary.main" : "transparent",
            "color": done ? "secondary.contrastText" : "text.secondary",
            "cursor": onToggle ? "pointer" : "default",
            "&:hover": onToggle ? { boxShadow: "0 0 6px currentColor" } : undefined,
          }}
        >
          {passIndex + 1}
        </Box>
      )
    })}
  </Stack>
)
