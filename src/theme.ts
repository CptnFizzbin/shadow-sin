import { createTheme } from "@mui/material/styles";

const DISPLAY_FONT = '"Smooch Sans", sans-serif';
const BODY_FONT = '"Monda", monospace, sans-serif';

export const theme = createTheme({
	cssVariables: true,
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: "#7c3aed",
					light: "#a78bfa",
					dark: "#5b21b6",
				},
				secondary: {
					main: "#06b6d4",
					light: "#67e8f9",
					dark: "#0891b2",
				},
				background: {
					default: "#f5f0ff",
					paper: "#ede8ff",
				},
				divider: "rgba(124, 58, 237, 0.2)",
			},
		},
		dark: {
			palette: {
				primary: {
					main: "#c084fc",
					light: "#e879f9",
					dark: "#a855f7",
				},
				secondary: {
					main: "#22d3ee",
					light: "#67e8f9",
					dark: "#0891b2",
				},
				background: {
					default: "#07000f",
					paper: "#0e0020",
				},
				text: {
					primary: "#f3e8ff",
					secondary: "#a78bfa",
				},
				divider: "rgba(192, 132, 252, 0.2)",
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
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					textTransform: "uppercase",
					letterSpacing: "0.12em",
				},
				contained: {
					boxShadow: "none",
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

		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					backgroundImage: "none",
					border: "1px solid",
					borderColor: "inherit",
				},
				outlined: {
					border: "1px solid",
				},
			},
		},

		MuiAppBar: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					backgroundImage: "none",
					boxShadow: "none",
					borderBottom: "1px solid",
				},
			},
		},

		MuiChip: {
			styleOverrides: {
				root: { borderRadius: 0 },
			},
		},

		MuiOutlinedInput: {
			styleOverrides: {
				root: { borderRadius: 0 },
			},
		},

		MuiTooltip: {
			styleOverrides: {
				tooltip: { borderRadius: 0 },
			},
		},

		MuiMenu: {
			styleOverrides: {
				paper: { borderRadius: 0 },
			},
		},
	},
});
