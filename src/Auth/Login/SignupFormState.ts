import { Dispatch, Reducer, useReducer } from 'react'

interface FormState {
  username: {
    value: string
    error: string | null
    dirty: boolean
  }
  password: {
    value: string
    error: string | null
    dirty: boolean
  }
  confirmPassword: {
    value: string
    error: string | null
    dirty: boolean
  }
  submitting: boolean
  valid: boolean
  dirty: boolean
  error: string | null
}

export const defaultState: FormState = {
  username: {
    dirty: false,
    error: null,
    value: '',
  },

  confirmPassword: {
    dirty: false,
    error: null,
    value: '',
  },

  password: {
    dirty: false,
    error: null,
    value: '',
  },

  dirty: false,
  valid: false,
  submitting: false,
  error: null,
}

type FormAction =
  | { type: 'setUsername'; value: string }
  | { type: 'blurUsername' }
  | { type: 'setPassword'; value: string }
  | { type: 'blurPassword' }
  | { type: 'setConfirmPassword'; value: string }
  | { type: 'blurConfirmPassword' }
  | { type: 'error'; error: string }
  | { type: 'submit' }

const reducer: Reducer<FormState, FormAction> = (state, action): FormState => {
  switch (action.type) {
    case 'setUsername':
      return {
        ...state,
        username: {
          ...state.username,
          error: validateUsername(action.value),
          value: action.value,
        },
      }
    case 'blurUsername':
      return {
        ...state,
        username: {
          ...state.username,
          dirty: true,
        },
      }
    case 'setPassword':
      return {
        ...state,
        password: {
          ...state.password,
          value: action.value,
          error: validatePassword(action.value),
        },
      }
    case 'blurPassword':
      return {
        ...state,
        password: {
          ...state.password,
          dirty: true,
        },
      }
    case 'setConfirmPassword':
      return {
        ...state,
        confirmPassword: {
          ...state.confirmPassword,
          value: action.value,
          error: validateConfirmPassword(state.password.value, action.value),
        },
      }
    case 'blurConfirmPassword':
      return {
        ...state,
        confirmPassword: {
          ...state.confirmPassword,
          dirty: true,
        },
      }
    case 'submit':
      return {
        ...state,
        submitting: true,
        error: null,
      }
    case 'error':
      return {
        ...state,
        submitting: false,
        error: action.error,
      }
    default:
      return state
  }
}

function validateUsername (username: string): string | null {
  if (!username || username.trim() === '')
    return 'Username is required'

  return null
}

function validatePassword (password: string): string | null {
  if (!password || password === '')
    return 'Password is required'

  if (password.length <= 10)
    return 'Password must be longer then 10 characters'

  return null
}

function validateConfirmPassword (confirmPassword: string, password: string): string | null {
  if (confirmPassword !== password)
    return 'Password doesn\'t match'

  return null
}

export const useFormState = (): [FormState, Dispatch<FormAction>] => {
  return useReducer(reducer, defaultState)
}
