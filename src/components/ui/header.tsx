import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useColorScheme } from "@mui/material/styles"
import { RiHome2Line, RiMoonLine, RiSunLine } from "@remixicon/react"
import { Link } from "@tanstack/react-router"
import type { FC } from "react"

export const Header: FC = () => {
  const { mode, setMode } = useColorScheme()

  const handleToggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light")
  }

  return (
    <Paper role="banner">
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <IconButton component={Link} to="/">
          <RiHome2Line />
        </IconButton>

        <Typography variant="h1" sx={{ fontSize: 24 }}>
          ShadowSIN
        </Typography>

        <IconButton onClick={handleToggleColorMode} aria-label="toggle color mode" sx={{ color: "text.primary" }}>
          {mode === "light" ? <RiMoonLine /> : <RiSunLine />}
        </IconButton>
      </Stack>
    </Paper>
  )
}
