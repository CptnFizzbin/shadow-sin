import { Button, TextField, Typography } from '@mui/material'
import { ChangeEvent, FC, useState } from 'react'

import { ServerApi } from '../../Api/ServerApi'
import { useAuth } from '../AuthProvider'

interface LoginFormProps {
  onLogin (): void
}

export const LoginForm: FC<LoginFormProps> = ({
  onLogin,
}) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [authorizing, setAuthorizing] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const { login } = useAuth()

  const onSubmit = () => {
    setAuthorizing(true)

    login(username, password)
      .then(() => onLogin())
      .catch((error) => {
        setAuthorizing(false)

        if (ServerApi.isApiError(error)) {
          setMessage(error.msg)
        } else {
          console.error(error)
          setMessage('Server Error')
        }
      })
  }

  return <form onSubmit={onSubmit}>
    <TextField
      autoFocus
      label="Username"
      fullWidth
      sx={{ marginBottom: 1 }}
      variant="outlined"
      value={username}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
      disabled={authorizing}
    />

    <TextField
      label="Password"
      fullWidth
      type="password"
      variant="outlined"
      sx={{ marginBottom: 1 }}
      value={password}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      disabled={authorizing}
    />

    {message && (
      <Typography sx={{ textAlign: 'center', marginBottom: 1 }}>{message}</Typography>
    )}

    <Button type="submit" variant="contained" onClick={onSubmit} disabled={authorizing} fullWidth>
      {authorizing ? 'Connecting...' : 'Login'}
    </Button>
  </form>
}
