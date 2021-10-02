import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material'
import { FC, useState } from 'react'

import { ServerApi } from '../Api/ServerApi'
import { useAuth } from './AuthProvider'

interface LoginDialogProps {
  open?: boolean

  onClose (): void
}

export const LoginDialog: FC<LoginDialogProps> = ({
  open = false,
  onClose,
}) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [authorizing, setAuthorizing] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const { login } = useAuth()

  const onSubmit = () => {
    setAuthorizing(true)
    setMessage('Connecting...')

    login(username, password)
      .then(() => onClose())
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
    >
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ padding: 1 }}>
          <TextField
            autoFocus
            label="Username"
            margin="dense"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={authorizing}
          />

          <TextField
            label="Password"
            margin="dense"
            fullWidth
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authorizing}
          />

          {message && <Typography>{message}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            onClick={onSubmit}
            disabled={authorizing}
            fullWidth
          >
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
