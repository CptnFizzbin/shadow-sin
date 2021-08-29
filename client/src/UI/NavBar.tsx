import { AppBar, Box, IconButton, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { FC } from 'react'

interface NavBarProps {
  onOpenDrawer (): void
}

export const NavBar: FC<NavBarProps> = ({
  onOpenDrawer,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => onOpenDrawer()}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ShadowSIN 6e
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
