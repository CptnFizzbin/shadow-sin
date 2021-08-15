import { AppBar, Toolbar, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

export const NavBar: FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ShadowSIN 6e
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
