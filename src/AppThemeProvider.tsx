/* eslint-disable @typescript-eslint/no-empty-interface */
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { FC } from "react"

export const displayFontFamily = '"Comfortaa", "Helvetica", "Arial", sans-serif'

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#CE93D8",
    },
    secondary: {
      main: "#03A9F4",
    },
    text: {
      primary: "#EEEEEE",
    },
    background: {
      default: "#2D2736",
    },
  },

  typography: {
    h1: { fontFamily: displayFontFamily },
    h2: { fontFamily: displayFontFamily },
    h3: { fontFamily: displayFontFamily },
    h4: { fontFamily: displayFontFamily },
    h5: { fontFamily: displayFontFamily },
    h6: { fontFamily: displayFontFamily },
  },
})

export const AppThemeProvider: FC = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  )
}
