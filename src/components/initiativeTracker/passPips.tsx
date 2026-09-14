import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import type { FC, MouseEvent } from "react"

interface PassPipsProps {
  total: number
  completed: number[]
  onToggle?: (passIndex: number) => void
  /**
   * When set, distinguishes three states instead of a plain done/not-done
   * toggle: passes before the next incomplete one are greyed out as "already
   * happened", the next incomplete pass is highlighted as current, and later
   * passes are left in the default upcoming style.
   */
  highlightCurrent?: boolean
}

export const PassPips: FC<PassPipsProps> = ({ total, completed, onToggle, highlightCurrent }) => {
  const currentPassIndex = highlightCurrent
    ? Array.from({ length: total }, (_, passIndex) => passIndex).find((passIndex) => !completed.includes(passIndex))
    : undefined

  return (
    <Stack direction="row" sx={{ gap: 0.5, justifyContent: "flex-start" }}>
      {Array.from({ length: total }, (_, passIndex) => {
        const done = completed.includes(passIndex)
        const isCurrent = highlightCurrent && !done && passIndex === currentPassIndex
        const isPast = highlightCurrent && done

        let borderColor = "divider"
        let backgroundColor = "transparent"
        let color = "text.secondary"

        if (isPast) {
          borderColor = "divider"
          backgroundColor = "action.disabledBackground"
          color = "text.disabled"
        } else if (isCurrent) {
          borderColor = "primary.main"
          backgroundColor = "primary.main"
          color = "primary.contrastText"
        } else if (!highlightCurrent && done) {
          borderColor = "secondary.main"
          backgroundColor = "secondary.main"
          color = "secondary.contrastText"
        }

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
              "borderColor": borderColor,
              "backgroundColor": backgroundColor,
              "color": color,
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
}
