/* eslint-disable @typescript-eslint/no-empty-interface */
import { createTheme, ThemeProvider } from '@material-ui/core'
import { FC } from 'react'

const headingFontFamily = '"Comfortaa", "Helvetica", "Arial", sans-serif'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CE93D8',
    },
    secondary: {
      main: '#03A9F4',
    },
    text: {
      primary: '#EEEEEE',
    },
    background: {
      default: '#2D2736',
    },
  },

  typography: {
    h1: { fontFamily: headingFontFamily },
    h2: { fontFamily: headingFontFamily },
    h3: { fontFamily: headingFontFamily },
    h4: { fontFamily: headingFontFamily },
    h5: { fontFamily: headingFontFamily },
    h6: { fontFamily: headingFontFamily },
  },
})

export const AppThemeProvider: FC = ({
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )
}
