import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/notes")({
  component: RouteComponent,
})

function RouteComponent() {
  const [runNotes, setRunNotes] = useState("")

  return (
    <Stack sx={{ gap: 1, height: "100%", flexGrow: 1 }}>
      <SectionHeader>Run Notes</SectionHeader>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Ephemeral session scratch pad. These notes are <strong>not</strong> saved to your character record and will be lost when you reload the page.
      </Typography>

      <TextField
        multiline
        minRows={15}
        variant="outlined"
        placeholder="Jot down session notes, NPC names, temporary status effects..."
        value={runNotes}
        onChange={(e) => setRunNotes(e.target.value)}
        fullWidth
        sx={{
          flexGrow: 1,
          "& .MuiInputBase-root": {
            fontFamily: "monospace",
            alignItems: "flex-start",
            height: "100%",
          }
        }}
      />
    </Stack>
  )
}
