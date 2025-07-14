import { Paper } from "@mui/material"
import Box from "@mui/material/Box"
import { FC } from "react"

interface StatBlockProps {
  vertical?: boolean
}

export const StatBlock: FC<StatBlockProps> = ({ vertical, children }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        padding: 1,
        gap: 1,
        flexWrap: "wrap",
        flexDirection: vertical ? "column" : "row",
        justifyContent: "space-around",
      }}
    >
      {children}
    </Paper>
  )
}

interface StatProps {
  name: string
  value: string | number | null | undefined
}

export const Stat: FC<StatProps> = ({ name, value }) => {
  if (name === "Essence") {
    value = (value as number).toFixed(2).toString()
  }

  return (
    <Box sx={{ display: "flex", gap: 1, whiteSpace: "nowrap" }}>
      <Box
        sx={{
          fontSize: 14,
          display: "inline-block",
          color: "primary.main",
          textAlign: "left",
          flexGrow: 1,
        }}
      >
        {name}
      </Box>
      <Box
        sx={{
          fontSize: 14,
          display: "inline-block",
          textAlign: "right",
          flexGrow: 1,
        }}
      >
        {value || "-"}
      </Box>
    </Box>
  )
}
