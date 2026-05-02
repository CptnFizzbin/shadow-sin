import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { produce } from "immer"
import { useState } from "react"

import {
  useCharacterSheet,
  useCharacterSheetContext,
} from "#/components/character/sheet/characterSheetProvider.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$characterId/notes")({
  component: RouteComponent,
})

function RouteComponent() {
  const store = useCharacterSheetContext()
  const profile = useCharacterSheet((s) => s.profile)

  const [description, setDescription] = useState(profile.description ?? "")
  const [personality, setPersonality] = useState(profile.personality ?? "")
  const [runNotes, setRunNotes] = useState("")

  const handleDescriptionBlur = () => {
    store.setState(
      produce((draft) => {
        draft.profile.description = description || undefined
      }),
    )
  }

  const handlePersonalityBlur = () => {
    store.setState(
      produce((draft) => {
        draft.profile.personality = personality || undefined
      }),
    )
  }

  return (
    <Stack sx={{ gap: 2, height: "100%", flexGrow: 1, pb: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <SectionHeader>Background / Description</SectionHeader>
        <TextField
          multiline
          minRows={4}
          variant="outlined"
          placeholder="Character background, appearance, and history..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          fullWidth
        />
      </Stack>

      <Stack sx={{ gap: 1 }}>
        <SectionHeader>Personality</SectionHeader>
        <TextField
          multiline
          minRows={3}
          variant="outlined"
          placeholder="Character traits, quirks, and behavioral notes..."
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          onBlur={handlePersonalityBlur}
          fullWidth
        />
      </Stack>

      <Stack sx={{ gap: 1, height: "100%", flexGrow: 1 }}>
        <SectionHeader>Run Notes</SectionHeader>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Ephemeral session scratch pad. These notes are <strong>not</strong> saved to your character record and will be lost when you reload the page.
        </Typography>

        <TextField
          multiline
          minRows={8}
          variant="outlined"
          placeholder="Jot down session notes, NPC names, temporary status effects..."
          value={runNotes}
          onChange={(e) => setRunNotes(e.target.value)}
          fullWidth
          sx={{
            "flexGrow": 1,
            "& .MuiInputBase-root": {
              fontFamily: "monospace",
              alignItems: "flex-start",
              height: "100%",
            },
          }}
        />
      </Stack>
    </Stack>
  )
}
