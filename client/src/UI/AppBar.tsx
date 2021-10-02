import MenuIcon from '@mui/icons-material/Menu'
import { AppBar as MuiAppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { FC } from 'react'

import { noOp } from '../Helpers'

type NavBarProps = {
  withMenu?: boolean
  openMenu? (): void
}

export const AppBar: FC<NavBarProps> = ({
  withMenu,
  openMenu = noOp,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position="static">
        <Toolbar>
          {withMenu && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => openMenu()}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ShadowSIN 6e
          </Typography>
        </Toolbar>
      </MuiAppBar>
    </Box>
  )
}
