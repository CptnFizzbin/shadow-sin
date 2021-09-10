import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, SvgIcon } from '@material-ui/core'
import { FC, ReactElement } from 'react'
import { useHistory } from 'react-router-dom'

export interface NavDrawerProps {
  open: boolean

  closeDrawer (): void
}

export const NavDrawer: FC<NavDrawerProps> = ({
  open,
  closeDrawer,
  children,
}) => {
  return (
    <Drawer anchor="left" open={open} onClose={closeDrawer}>
      {children}

      <Box sx={{ flexGrow: 1 }} />

      <List>
        <NavButton
          icon={<FontAwesomeIcon icon={faUsers} />}
          label="Characters"
          routeTo={'/characters'}
          closeDrawer={closeDrawer}
        />
      </List>
    </Drawer>
  )
}

interface NavButtonProps {
  icon: ReactElement
  label: string
  routeTo: string

  closeDrawer (): void
}

export const NavButton: FC<NavButtonProps> = ({
  icon,
  label,
  routeTo,
  closeDrawer,
}) => {
  const history = useHistory()

  const onNavClick = () => {
    history.push(routeTo)
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
