import { Button, TextField, Typography } from '@mui/material'
import { ChangeEvent, FC } from 'react'

import { ServerApi } from '../../Api/ServerApi'
import { useAuth } from '../AuthProvider'
import { useFormState } from './SignupFormState'

interface SignupFormProps {
  onSignup (): void
}

export const SignupForm: FC<SignupFormProps> = ({
  onSignup,
}) => {
  const [form, dispatch] = useFormState()

  const { signup } = useAuth()

  const onSubmit = () => {
    dispatch({ type: 'submit' })

    signup(form.username.value, form.password.value)
      .then(() => onSignup())
      .catch((error) => {
        if (ServerApi.isApiError(error)) {
          dispatch({ type: 'error', error: error.msg })
        } else {
          console.error(error)
          dispatch({ type: 'error', error: 'Server Error' })
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
      value={form.username.value}
      onBlur={() => dispatch({ type: 'blurUsername' })}
      onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({
        type: 'setUsername',
        value: e.target.value,
      })}
      disabled={form.submitting}
    />

    {form.username.dirty && form.username.error && (
      <Typography sx={{ marginBottom: 1 }}>{form.username.error}</Typography>
    )}

    <TextField
      label="Password"
      fullWidth
      type="password"
      variant="outlined"
      sx={{ marginBottom: 1 }}
      value={form.password.value}
      onBlur={() => dispatch({ type: 'blurPassword' })}
      onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({
        type: 'setPassword',
        value: e.target.value,
      })}
      disabled={form.submitting}
    />

    {form.password.dirty && form.password.error && (
      <Typography sx={{ marginBottom: 1 }}>{form.password.error}</Typography>
    )}

    <TextField
      label="Confirm Password"
      fullWidth
      type="password"
      variant="outlined"
      sx={{ marginBottom: 1 }}
      value={form.confirmPassword.value}
      onBlur={() => dispatch({ type: 'blurConfirmPassword' })}
      onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({
        type: 'setConfirmPassword',
        value: e.target.value,
      })}
      disabled={form.submitting}
    />

    {form.confirmPassword.dirty && form.confirmPassword.error && (
      <Typography sx={{ marginBottom: 1 }}>{form.confirmPassword.error}</Typography>
    )}

    {form.error && (
      <Typography sx={{ textAlign: 'center', marginBottom: 1 }}>{form.error}</Typography>
    )}

    <Button type="submit" variant="contained" onClick={onSubmit} disabled={form.submitting} fullWidth>
      {form.submitting ? 'Registering...' : 'Login'}
    </Button>
  </form>
}
