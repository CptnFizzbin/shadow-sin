import { faCarAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, SvgIcon } from '@material-ui/core'
import { FC, ReactElement } from 'react'
import { useHistory } from 'react-router-dom'

import { PistolSvg } from '../Gear/Weapons/PistolSvg'

interface NavDrawerProps {
  open: boolean

  onClose (): void
}

export const NavDrawer: FC<NavDrawerProps> = ({
  open,
  onClose,
}) => {
  const history = useHistory()

  const onNavClick = (route: string) => {
    history.push(route)
    onClose()
  }

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <NavButton
          icon={<FontAwesomeIcon icon={faUser} />}
          label="Character"
          onClick={() => onNavClick('/character')}
        />
        <NavButton
          icon={<PistolSvg />}
          label="Weapons"
          onClick={() => onNavClick('/weapons')}
        />
        <NavButton
          icon={<FontAwesomeIcon icon={faCarAlt} />}
          label="Vehicles"
          onClick={() => onNavClick('/vehicles')}
        />
      </List>
    </Drawer>
  )
}

interface NavButtonProps {
  icon: ReactElement
  label: string

  onClick (): void
}

const NavButton: FC<NavButtonProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        <SvgIcon>{icon}</SvgIcon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  )
}
