import { createTheme } from "@mui/material/styles"

const DISPLAY_FONT = "\"Smooch Sans\", sans-serif"
const BODY_FONT = "\"Monda\", monospace, sans-serif"

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#7C3AED",
          light: "#A78BFA",
          dark: "#5B21B6",
        },
        secondary: {
          main: "#06B6D4",
          light: "#67E8F9",
          dark: "#0891B2",
        },
        background: {
          default: "#F5F0FF",
          paper: "#EDE8FF",
        },
        divider: "rgba(124, 58, 237, 0.5)",
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#C084FC",
          light: "#E879F9",
          dark: "#A855F7",
        },
        secondary: {
          main: "#22D3EE",
          light: "#67E8F9",
          dark: "#0891B2",
        },
        background: {
          default: "#07000F",
          paper: "#0E0020",
        },
        text: {
          primary: "#F3E8FF",
          secondary: "#A78BFA",
        },
        divider: "rgba(192, 132, 252, 0.5)",
      },
    },
  },

  shape: {
    borderRadius: 2,
  },

  typography: {
    fontFamily: BODY_FONT,
    h1: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    h2: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    h3: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    h4: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    h5: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    h6: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    overline: {
      fontFamily: BODY_FONT,
      letterSpacing: "0.2em",
      fontWeight: 700,
    },
    button: {
      fontFamily: BODY_FONT,
      letterSpacing: "0.1em",
      fontWeight: 700,
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        },
        contained: {
          "boxShadow": "none",
          "&:hover": {
            boxShadow: "0 0 12px currentColor",
          },
        },
        outlined: {
          "&:hover": {
            boxShadow: "0 0 8px currentColor",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },

    MuiInput: {
      defaultProps: {
        size: "small",
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 0 },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },

    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },

    MuiStack: {
      defaultProps: {
        gap: 1,
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 0 },
      },
    },
  },
})
