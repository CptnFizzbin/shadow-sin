import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { Theme } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { createFileRoute } from "@tanstack/react-router"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { useEffect } from "react"

import { Prototype } from "#/components/ui/prototype/prototype.tsx"

export const Route = createFileRoute("/test/theme/gallery")({
  component: ThemeGalleryPage,
})

/**
 * Three fully-worked retrotech theme concepts, browsable in place via
 * `Prototype`. Each is a self-contained MUI theme + demo "screen" evoking a
 * different corner of the Shadowrun setting. Pick one (or steal pieces from
 * several) before folding a winner into `src/theme.ts` — this route and its
 * variants are throwaway once that decision is made.
 */
const versions = [
  { key: "lonestar", name: "Lone Star Rap Sheet" },
  { key: "aztech", name: "Aztechnology Information Systems" },
  { key: "lcars", name: "Angular LCARS" },
]

function ThemeGalleryPage() {
  return (
    <Prototype versions={versions}>
      <Prototype.Item version="lonestar">
        <LoneStarShowcase />
      </Prototype.Item>
      <Prototype.Item version="aztech">
        <AztechShowcase />
      </Prototype.Item>
      <Prototype.Item version="lcars">
        <LcarsShowcase />
      </Prototype.Item>
    </Prototype>
  )
}

/** Injects a Google Fonts stylesheet while mounted, removes it on unmount. */
function useGoogleFont(href: string) {
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    document.head.append(link)
    return () => link.remove()
  }, [href])
}

interface ScreenProps extends PropsWithChildren {
  theme: Theme
}

/** Full-bleed themed surface so each variant reads like its own app skin, not just a swatch. */
const Screen: FC<ScreenProps> = ({ theme, children }) => (
  <ThemeProvider theme={theme}>
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        padding: 2,
        paddingBottom: 8,
      }}
    >
      {children}
    </Box>
  </ThemeProvider>
)

// ---------------------------------------------------------------------------
// Lone Star Rap Sheet — a CRT booking terminal spitting out a criminal record.
// Phosphor green readout, typewriter case-file text, rubber-stamp red alerts.
// ---------------------------------------------------------------------------

const LONESTAR_DISPLAY_FONT = "\"Special Elite\", \"Courier New\", monospace"
const LONESTAR_BODY_FONT = "\"Courier Prime\", \"Courier New\", monospace"

const loneStarTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4ADE80", light: "#86EFAC", dark: "#22C55E" },
    secondary: { main: "#E8342B", light: "#F87171", dark: "#B91C1C" },
    background: { default: "#050B06", paper: "#0C160D" },
    text: { primary: "#BBF7CE", secondary: "#5FA579" },
    divider: "rgba(74, 222, 128, 0.35)",
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: LONESTAR_BODY_FONT,
    h1: { fontFamily: LONESTAR_DISPLAY_FONT, fontSize: 40 },
    h2: { fontFamily: LONESTAR_DISPLAY_FONT, fontSize: 28 },
    h3: { fontFamily: LONESTAR_DISPLAY_FONT, fontSize: 20 },
    overline: { fontFamily: LONESTAR_BODY_FONT, fontWeight: 700, letterSpacing: 2 },
    button: { fontFamily: LONESTAR_BODY_FONT, fontWeight: 700, letterSpacing: 1 },
  },
  components: {
    MuiPaper: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { borderStyle: "dashed" } },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 0 } } },
  },
})

const LoneStarShowcase: FC = () => {
  useGoogleFont("https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap")

  return (
    <Screen theme={loneStarTheme}>
      <Stack sx={{ gap: 2 }}>
        <Box sx={{ position: "relative" }}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="overline" color="secondary">Lone Star Security Services</Typography>
            <Typography variant="h1">Criminal Record Division</Typography>
            <Typography color="text.secondary">
              CASE FILE #SEA-4471-K &middot; SEATTLE METROPLEX &middot; PRINTED VIA SECURE UPLINK
            </Typography>
          </Paper>
          <Chip
            label="FLAGGED"
            color="secondary"
            variant="outlined"
            sx={{
              position: "absolute",
              top: 16,
              right: 24,
              transform: "rotate(-8deg)",
              borderWidth: 2,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          />
        </Box>

        <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
          <Paper sx={{ width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="overline" color="text.secondary">Booking Photo<br />on file</Typography>
          </Paper>

          <Paper sx={{ flex: 1, minWidth: 280, padding: 2 }}>
            <Stack sx={{ gap: 1 }}>
              <FieldRow label="ALIAS">&quot;Wraith&quot;</FieldRow>
              <FieldRow label="SIN">Invalid / Forged</FieldRow>
              <FieldRow label="THREAT RATING">Orange — Armed &amp; Augmented</FieldRow>
              <FieldRow label="LAST SIGHTING">Redmond Barrens, 03:14</FieldRow>
              <FieldRow label="STATUS">
                <Chip size="small" color="secondary" label="ACTIVE WARRANT" sx={{ mr: 1 }} />
                <Chip size="small" variant="outlined" color="primary" label="KNOWN ASSOCIATE" />
              </FieldRow>
            </Stack>
          </Paper>
        </Stack>

        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          <Button variant="contained" color="secondary">Flag Suspect</Button>
          <Button variant="outlined" color="primary">Run Background Check</Button>
          <Button variant="text" color="primary">Archive</Button>
        </Stack>

        <TypeScale />
      </Stack>
    </Screen>
  )
}

// ---------------------------------------------------------------------------
// Aztechnology Information Systems — Mesoamerican megacorp mainframe.
// Gold and turquoise on obsidian, stepped-pyramid chrome, blood-red alerts.
// ---------------------------------------------------------------------------

const AZTECH_DISPLAY_FONT = "\"Michroma\", \"Segoe UI\", sans-serif"
const AZTECH_BODY_FONT = "\"Share Tech Mono\", monospace"

const aztechTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#D4A72C", light: "#E9C766", dark: "#A9821F" },
    secondary: { main: "#16C2B1", light: "#5EEBDC", dark: "#0E8E82" },
    error: { main: "#7A1220" },
    background: { default: "#120A0B", paper: "#1D1113" },
    text: { primary: "#F5E1B8", secondary: "#5EEBDC" },
    divider: "rgba(212, 167, 44, 0.35)",
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: AZTECH_BODY_FONT,
    h1: { fontFamily: AZTECH_DISPLAY_FONT, fontSize: 34, letterSpacing: 1 },
    h2: { fontFamily: AZTECH_DISPLAY_FONT, fontSize: 24, letterSpacing: 1 },
    h3: { fontFamily: AZTECH_DISPLAY_FONT, fontSize: 16, letterSpacing: 1 },
    overline: { fontFamily: AZTECH_BODY_FONT, fontWeight: 700, letterSpacing: 3 },
    button: { fontFamily: AZTECH_DISPLAY_FONT, fontWeight: 400, letterSpacing: 1 },
  },
  components: {
    MuiPaper: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { borderTop: "3px solid #D4A72C" } },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 0 } } },
  },
})

/** Nested boxes stepping inward, evoking a stone pyramid profile. */
const PyramidMotif: FC = () => (
  <Stack sx={{ alignItems: "center", gap: "2px", py: 1 }}>
    {[64, 48, 32, 16].map((width) => (
      <Box key={width} sx={{ width, height: 6, bgcolor: "primary.main", opacity: 0.8 }} />
    ))}
  </Stack>
)

const AztechShowcase: FC = () => {
  useGoogleFont("https://fonts.googleapis.com/css2?family=Michroma&family=Share+Tech+Mono&display=swap")

  return (
    <Screen theme={aztechTheme}>
      <Stack sx={{ gap: 2 }}>
        <Paper sx={{ padding: 2, textAlign: "center" }}>
          <PyramidMotif />
          <Typography variant="h1">Aztechnology</Typography>
          <Typography variant="overline" color="secondary">Information Systems Division</Typography>
          <Typography color="text.secondary">Tenochtitlan Central &middot; Secure Uplink Established</Typography>
        </Paper>

        <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
          <Paper sx={{ flex: 1, minWidth: 200, padding: 2 }}>
            <Typography variant="overline" color="text.secondary">Nexus Status</Typography>
            <Typography variant="h2" color="primary">Online</Typography>
          </Paper>
          <Paper sx={{ flex: 1, minWidth: 200, padding: 2 }}>
            <Typography variant="overline" color="text.secondary">Personafix Subscribers</Typography>
            <Typography variant="h2" color="secondary">2.3M</Typography>
          </Paper>
          <Paper sx={{ flex: 1, minWidth: 200, padding: 2 }}>
            <Typography variant="overline" color="text.secondary">Blood Index</Typography>
            <Typography variant="h2" color="error">Elevated</Typography>
          </Paper>
        </Stack>

        <Paper sx={{ padding: 2 }}>
          <Typography variant="overline" color="text.secondary">Regional Offices</Typography>
          <Stack sx={{ gap: 1, mt: 1 }}>
            <FieldRow label="TENOCHTITLAN">Corporate Court, Extraterritorial</FieldRow>
            <FieldRow label="SEATTLE">
              Downtown Enclave
              <Chip size="small" sx={{ ml: 1 }} color="primary" label="ACTIVE" />
            </FieldRow>
            <FieldRow label="AMAZONIA">
              Research Concession
              <Chip size="small" sx={{ ml: 1 }} color="error" label="RESTRICTED" />
            </FieldRow>
          </Stack>
        </Paper>

        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
          <Button variant="contained" color="primary">Initiate Uplink</Button>
          <Button variant="outlined" color="secondary">Request Clearance</Button>
          <Button variant="outlined" color="error">Terminate Session</Button>
        </Stack>

        <TypeScale />
      </Stack>
    </Screen>
  )
}

// ---------------------------------------------------------------------------
// Angular LCARS — the Federation console look, squared off. Chunky
// hard-cornered color blocks on black; this app's borderRadius:0 discipline
// already leans this way, so LCARS's usual pill shapes get cut to rectangles.
// ---------------------------------------------------------------------------

const LCARS_FONT = "\"Antonio\", \"Arial Narrow\", sans-serif"
const LCARS_MONO_FONT = "\"Share Tech Mono\", monospace"

const lcarsTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF9966", light: "#FFC299", dark: "#E5763F" },
    secondary: { main: "#9999FF", light: "#C2C2FF", dark: "#6E6ECF" },
    warning: { main: "#FFCC66" },
    background: { default: "#000000", paper: "#0A0A0F" },
    text: { primary: "#F5F0FF", secondary: "#FF9966" },
    divider: "rgba(255, 153, 102, 0.4)",
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: LCARS_MONO_FONT,
    h1: { fontFamily: LCARS_FONT, fontWeight: 700, fontSize: 44, textTransform: "uppercase" },
    h2: { fontFamily: LCARS_FONT, fontWeight: 700, fontSize: 28, textTransform: "uppercase" },
    h3: { fontFamily: LCARS_FONT, fontWeight: 700, fontSize: 18, textTransform: "uppercase" },
    overline: { fontFamily: LCARS_FONT, fontWeight: 700, letterSpacing: 2 },
    button: { fontFamily: LCARS_FONT, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" },
  },
  components: {
    MuiPaper: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { borderRadius: 0, borderWidth: 0 } },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0 },
        contained: { boxShadow: "none" },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 0, fontWeight: 700 } } },
  },
})

/** Sidebar of stacked hard-cornered blocks, standing in for the LCARS nav column. */
const LcarsRail: FC = () => {
  const blocks: { label: string, color: "primary" | "secondary" | "warning" }[] = [
    { label: "24-601", color: "primary" },
    { label: "STANDBY", color: "secondary" },
    { label: "READY", color: "warning" },
    { label: "COMMS", color: "primary" },
  ]

  return (
    <Stack sx={{ gap: "4px", width: 120 }}>
      {blocks.map(({ label, color }) => (
        <Box
          key={label}
          sx={{
            bgcolor: `${color}.main`,
            color: "#000000",
            padding: 1,
            fontFamily: LCARS_FONT,
            fontWeight: 700,
            textTransform: "uppercase",
            textAlign: "right",
          }}
        >
          {label}
        </Box>
      ))}
    </Stack>
  )
}

const LcarsShowcase: FC = () => {
  useGoogleFont("https://fonts.googleapis.com/css2?family=Antonio:wght@400;700&family=Share+Tech+Mono&display=swap")

  return (
    <Screen theme={lcarsTheme}>
      <Stack direction="row" sx={{ gap: "4px" }}>
        <LcarsRail />

        <Stack sx={{ gap: "4px", flex: 1 }}>
          <Box sx={{ bgcolor: "primary.main", color: "#000000", padding: 2 }}>
            <Typography variant="h1">Angular LCARS</Typography>
          </Box>

          <Stack direction="row" sx={{ gap: "4px", flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 200, bgcolor: "background.paper", borderLeft: "12px solid", borderColor: "secondary.main", padding: 2 }}>
              <Typography variant="overline" color="text.secondary">Hull Integrity</Typography>
              <Typography variant="h2" color="primary">98%</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200, bgcolor: "background.paper", borderLeft: "12px solid", borderColor: "warning.main", padding: 2 }}>
              <Typography variant="overline" color="text.secondary">Power Levels</Typography>
              <Typography variant="h2" color="warning.main">Nominal</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200, bgcolor: "background.paper", borderLeft: "12px solid", borderColor: "primary.main", padding: 2 }}>
              <Typography variant="overline" color="text.secondary">Matrix Link</Typography>
              <Typography variant="h2" color="secondary">Locked</Typography>
            </Box>
          </Stack>

          <Box sx={{ bgcolor: "background.paper", padding: 2 }}>
            <Typography variant="overline" color="text.secondary">Console Readout</Typography>
            <Stack sx={{ gap: 1, mt: 1, fontFamily: LCARS_MONO_FONT }}>
              <FieldRow label="24-601-A">Sensor sweep complete, no contacts</FieldRow>
              <FieldRow label="24-601-B">Shields at full capacity</FieldRow>
              <FieldRow label="24-601-C">
                Away team status
                <Chip size="small" sx={{ ml: 1 }} color="secondary" label="EN ROUTE" />
              </FieldRow>
            </Stack>
          </Box>

          <Stack direction="row" sx={{ gap: "4px", flexWrap: "wrap" }}>
            <Button variant="contained" color="primary">Engage</Button>
            <Button variant="contained" color="secondary">Hail</Button>
            <Button variant="contained" color="warning">Red Alert</Button>
          </Stack>

          <TypeScale />
        </Stack>
      </Stack>
    </Screen>
  )
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

interface FieldRowProps extends PropsWithChildren {
  label: string
}

const FieldRow: FC<FieldRowProps> = ({ label, children }) => (
  <Stack direction="row" sx={{ gap: 2, alignItems: "baseline" }}>
    <Box sx={{ minWidth: 140, flexShrink: 0 }}>
      <Typography variant="overline" color="text.secondary">{label}</Typography>
    </Box>
    <Typography component="div">{children}</Typography>
  </Stack>
)

/** A quick h1–h3 + body ladder so a theme's type scale reads at a glance. */
const TypeScale: FC = () => (
  <Paper sx={{ padding: 2 }}>
    <Stack sx={{ gap: 1 }}>
      <TypeScaleRow variant="h1">Heading One</TypeScaleRow>
      <TypeScaleRow variant="h2">Heading Two</TypeScaleRow>
      <TypeScaleRow variant="h3">Heading Three</TypeScaleRow>
      <Typography>
        Body copy sets the baseline reading experience — long enough to judge line height, letter
        spacing, and how the body font holds up next to the display face above.
      </Typography>
    </Stack>
  </Paper>
)

const TypeScaleRow: FC<{ variant: "h1" | "h2" | "h3", children: ReactNode }> = ({ variant, children }) => (
  <Typography variant={variant}>{children}</Typography>
)
