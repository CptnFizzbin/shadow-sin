import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Drawer, List } from '@material-ui/core'

import { NavButton, NavDrawer } from './index'

export const DefaultNavDrawer: NavDrawer = ({
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
