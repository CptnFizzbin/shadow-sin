import { Box, Button, Paper, TextField, Typography } from '@material-ui/core'
import { FC, useEffect, useState } from 'react'

import { ServerApi } from '../Api/ServerApi'
import { useAuth } from './AuthProvider'

export const LoginPage: FC = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [authorizing, setAuthorizing] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const { login, fetchUser } = useAuth()

  useEffect(() => {
    setAuthorizing(true)
    fetchUser().catch(() => setAuthorizing(false))
  }, [fetchUser])

  const onSubmit = () => {
    setAuthorizing(true)
    setMessage('Connecting...')

    login(username, password).catch((error) => {
      setAuthorizing(false)
      if (ServerApi.isApiError(error)) {
        setMessage(error.msg)
      } else {
        console.error(error)
        setMessage('Server Error')
      }
    })
  }

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
