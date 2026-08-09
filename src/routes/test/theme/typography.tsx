import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import type { FC, ReactNode } from "react"

export const Route = createFileRoute("/test/theme/typography")({
  component: TypographyTestPage,
})

interface SectionProps {
  title: string
  children: ReactNode
}

const Section: FC<SectionProps> = ({ title, children }) => (
  <Stack>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    <Divider />
    {children}
  </Stack>
)

interface VariantRowProps {
  label: string
  children: ReactNode
}

const VariantRow: FC<VariantRowProps> = ({ label, children }) => (
  <Stack direction="row" sx={{ gap: 2, alignItems: "baseline" }}>
    <Box sx={{ minWidth: 120, flexShrink: 0 }}>
      <Typography color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Box sx={{ flexGrow: 1 }}>{children}</Box>
  </Stack>
)

const SAMPLE_HEADING = "The quick brown fox"
const SAMPLE_BODY = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
const SAMPLE_LONG = `Shadowrunners live on the razor's edge between the megacorps and the shadows. Every
run is a calculated risk; every credit earned is bought with skill, nerve, and a little bit of luck.
The Matrix flows like neon rivers through the sprawl, and those who know how to swim in it are worth
their weight in nuyen.`

function TypographyTestPage() {
  return (
    <Stack sx={{ gap: 3, padding: 2 }}>
      <Typography variant="h2">Typography Test Page</Typography>

      {/* Headings */}
      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Headings — Display Font (Smooch Sans)">
            <VariantRow label="h1">
              <Typography variant="h1">{SAMPLE_HEADING}</Typography>
            </VariantRow>
            <VariantRow label="h2">
              <Typography variant="h2">{SAMPLE_HEADING}</Typography>
            </VariantRow>
            <VariantRow label="h3">
              <Typography variant="h3">{SAMPLE_HEADING}</Typography>
            </VariantRow>
            <VariantRow label="h4">
              <Typography variant="h4">{SAMPLE_HEADING}</Typography>
            </VariantRow>
            <VariantRow label="h5">
              <Typography variant="h5">{SAMPLE_HEADING}</Typography>
            </VariantRow>
            <VariantRow label="h6">
              <Typography variant="h6">{SAMPLE_HEADING}</Typography>
            </VariantRow>
          </Section>
        </Stack>
      </Paper>

      {/* Body & Subtitles */}
      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Body & Subtitles — Body Font (Monda)">
            <VariantRow label="subtitle1">
              <Typography variant="subtitle1">{SAMPLE_BODY}</Typography>
            </VariantRow>
            <VariantRow label="subtitle2">
              <Typography variant="subtitle2">{SAMPLE_BODY}</Typography>
            </VariantRow>
            <VariantRow label="body1">
              <Typography>{SAMPLE_LONG}</Typography>
            </VariantRow>
            <VariantRow label="body2">
              <Typography>{SAMPLE_LONG}</Typography>
            </VariantRow>
          </Section>
        </Stack>
      </Paper>

      {/* Utility variants */}
      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Utility Variants">
            <VariantRow label="button">
              <Typography variant="button">{SAMPLE_BODY}</Typography>
            </VariantRow>
            <VariantRow label="caption">
              <Typography>{SAMPLE_BODY}</Typography>
            </VariantRow>
            <VariantRow label="overline">
              <Typography variant="overline">{SAMPLE_BODY}</Typography>
            </VariantRow>
          </Section>
        </Stack>
      </Paper>

      {/* Color roles */}
      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Color Roles">
            <VariantRow label="text.primary">
              <Typography color="text.primary">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
            <VariantRow label="text.secondary">
              <Typography color="text.secondary">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
            <VariantRow label="text.disabled">
              <Typography color="text.disabled">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
            <VariantRow label="primary">
              <Typography color="primary">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
            <VariantRow label="secondary">
              <Typography color="secondary">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
            <VariantRow label="error">
              <Typography color="error">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
            <VariantRow label="warning">
              <Typography color="warning">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
            <VariantRow label="success">
              <Typography color="success">
                {SAMPLE_BODY}
              </Typography>
            </VariantRow>
          </Section>
        </Stack>
      </Paper>
    </Stack>
  )
}
