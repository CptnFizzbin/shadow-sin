import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar as MuiAppBar,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import React, { FC, useState } from 'react'

import { useAuth, useCurrentUser } from '../Auth/AuthProvider'
import { LoginDialog } from '../Auth/Login/LoginDialog'
import { noOp } from '../Helpers'

type NavBarProps = {
  withMenu?: boolean
  openMenu? (): void
}

export const AppBar: FC<NavBarProps> = ({
  withMenu,
  openMenu = noOp,
}) => {
  const { fetching: fetchingUser, user: currentUser } = useAuth()

  return (
    <MuiAppBar position="sticky" sx={{ top: 0 }}>
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

        {fetchingUser ? (
          <CircularProgress sx={{ width: '20px' }} />
        ) : (
          currentUser ? <UserMenu /> : <LoginButton />
        )}
      </Toolbar>
    </MuiAppBar>
  )
}

export const UserMenu: FC = () => {
  const currentUser = useCurrentUser()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { logout } = useAuth()

  if (!currentUser) return null

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setMenuOpen(true)
  }

  const onLogout = () => {
    logout().catch(console.error)
  }

  return (
    <>
      <Button onClick={openMenu}>{currentUser.username}</Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export const LoginButton: FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Login</Button>
      <LoginDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
