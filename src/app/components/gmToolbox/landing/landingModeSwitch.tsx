import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { useLocation, useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

type LandingMode = "characters" | "gm"

export const LandingModeSwitch: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mode: LandingMode = pathname.startsWith("/gm") ? "gm" : "characters"

  return (
    <Tabs
      value={mode}
      onChange={(_, value: LandingMode) => navigate({ to: value === "gm" ? "/gm" : "/" })}
      variant="fullWidth"
    >
      <Tab label="Character Select" value="characters" />
      <Tab label="GM Screen" value="gm" />
    </Tabs>
  )
}
