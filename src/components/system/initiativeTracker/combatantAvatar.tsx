import Avatar from "@mui/material/Avatar"
import type { FC } from "react"

interface CombatantAvatarProps {
  name: string
  isPC: boolean
  current?: boolean
  size?: number
}

export const CombatantAvatar: FC<CombatantAvatarProps> = ({ name, isPC, current, size = 36 }) => (
  <Avatar
    sx={{
      width: size,
      height: size,
      borderRadius: 0,
      fontWeight: "bold",
      bgcolor: isPC ? "primary.main" : "secondary.main",
      color: isPC ? "primary.contrastText" : "secondary.contrastText",
      border: current ? "2px solid" : "none",
      borderColor: "text.primary",
    }}
  >
    {name.trim().charAt(0).toUpperCase() || "?"}
  </Avatar>
)
