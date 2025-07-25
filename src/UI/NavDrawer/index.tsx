import { ListItem, ListItemIcon, ListItemText, SvgIcon } from "@mui/material"
import { FC, ReactElement } from "react"
import { useNavigate } from "react-router-dom"

export interface NavDrawerProps {
  open: boolean

  closeDrawer(): void
}

export type NavDrawer = FC<NavDrawerProps>

interface NavButtonProps {
  icon: ReactElement
  label: string
  routeTo: string

  closeDrawer(): void
}

export const NavButton: FC<NavButtonProps> = ({
  icon,
  label,
  routeTo,
  closeDrawer,
}) => {
  const navigate = useNavigate()

  const onNavClick = () => {
    navigate(routeTo)
    closeDrawer()
  }

  return (
    <ListItem button onClick={onNavClick}>
      <ListItemIcon>
        <SvgIcon>{icon}</SvgIcon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  )
}
