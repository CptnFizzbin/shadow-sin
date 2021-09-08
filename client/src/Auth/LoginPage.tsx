import { Box, Button, Paper, TextField, Typography } from '@material-ui/core'
import { FC, useState } from 'react'

import { useAuth } from './AuthProvider'

export const LoginPage: FC = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { authorizing, message, authorize } = useAuth()

  const onSubmit = () => {authorize(username, password)}

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={onSubmit}>
        <Paper sx={{ padding: 1, display: 'flex', gap: 1, flexDirection: 'column' }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={authorizing}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authorizing}
          />
          {message && <Typography>{message}</Typography>}
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={authorizing}
          >
            Login
          </Button>
        </Paper>
      </form>
    </Box>
  )
}
