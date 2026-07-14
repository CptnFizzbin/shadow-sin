import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import type { FC } from "react"

import { Prototype } from "#/components/ui/prototype/prototype.tsx"

export const Route = createFileRoute("/test/prototype")({
  component: PrototypeTestPage,
})

const StackedLayout: FC = () => (
  <Stack sx={{ gap: 2, padding: 2 }}>
    <Typography variant="h5">Stacked layout</Typography>
    <Paper sx={{ padding: 2 }}>
      <Typography>One card per row.</Typography>
    </Paper>
    <Paper sx={{ padding: 2 }}>
      <Typography>Second card.</Typography>
    </Paper>
  </Stack>
)

const InlineLayout: FC = () => (
  <Stack sx={{ gap: 2, padding: 2 }}>
    <Typography variant="h5">Inline layout</Typography>
    <Stack direction="row" sx={{ gap: 2 }}>
      <Paper sx={{ padding: 2, flex: 1 }}>
        <Typography>Side-by-side card.</Typography>
      </Paper>
      <Paper sx={{ padding: 2, flex: 1 }}>
        <Typography>Second card.</Typography>
      </Paper>
    </Stack>
    <Button variant="contained">Call to action</Button>
  </Stack>
)

function PrototypeTestPage() {
  return (
    <Prototype>
      <Prototype.Item title="Stacked">
        <StackedLayout />
      </Prototype.Item>
      <Prototype.Item title="Inline">
        <InlineLayout />
      </Prototype.Item>
    </Prototype>
  )
}
