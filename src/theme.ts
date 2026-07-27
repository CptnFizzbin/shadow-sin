import { createTheme } from "@mui/material/styles"

const DISPLAY_FONT = "\"Smooch Sans\", sans-serif"
const BODY_FONT = "\"Monda\", monospace, sans-serif"

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#2563EB",
          light: "#60A5FA",
          dark: "#1D4ED8",
        },
        secondary: {
          main: "#7C3AED",
          light: "#A78BFA",
          dark: "#5B21B6",
        },
        background: {
          default: "#EFF6FF",
          paper: "#DBEAFE",
        },
        text: {
          primary: "#1E1B4B",
          secondary: "#4338CA",
        },
        divider: "rgba(37, 99, 235, 0.5)",
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
    h1: {
      fontFamily: DISPLAY_FONT,
      fontWeight: 700,
      fontSize: 34,
    },
    h2: {
      fontFamily: DISPLAY_FONT,
      fontWeight: 700,
      fontSize: 26,
    },
    h3: {
      fontFamily: DISPLAY_FONT,
      fontWeight: 700,
      fontSize: 20,
    },
    h4: {
      fontFamily: DISPLAY_FONT,
      fontWeight: 700,
      fontSize: 17,
    },
    h5: {
      fontFamily: DISPLAY_FONT,
      fontWeight: 700,
      fontSize: 15,
    },
    h6: {
      fontFamily: DISPLAY_FONT,
      fontWeight: 700,
      fontSize: 13,
    },
    subtitle1: {
      fontSize: 13,
    },
    subtitle2: {
      fontSize: 12,
    },
    body1: {
      fontSize: 13,
    },
    body2: {
      fontSize: 12,
    },
    caption: {
      fontFamily: BODY_FONT,
      fontSize: 11,
    },
    overline: {
      fontFamily: BODY_FONT,
      fontWeight: 700,
      fontSize: 10,
    },
    button: {
      fontFamily: BODY_FONT,
      fontWeight: 700,
      fontSize: 12,
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

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },

    MuiDialogTitle: {
      defaultProps: {
        variant: "h3",
      },
      styleOverrides: {
        root: {
          padding: 8,
          textAlign: "center",
        },
      },
    },

    MuiGrid: {
      styleOverrides: {
        root: {
          height: "min-content",
        },
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
      styleOverrides: {
        root: {
          gap: 16,
        },
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
