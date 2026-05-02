import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Debouncer } from "@tanstack/pacer"
import { createFileRoute } from "@tanstack/react-router"
import { produce } from "immer"
import { useEffect, useMemo, useState } from "react"

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
  const [runNotes, setRunNotes] = useState(profile.runNotes ?? "")

  const saveDescription = useMemo(
    () =>
      new Debouncer(
        (value: string) =>
          store.setState(
            produce((draft) => {
              draft.profile.description = value || undefined
            }),
          ),
        { wait: 500 },
      ),
    [store],
  )

  const savePersonality = useMemo(
    () =>
      new Debouncer(
        (value: string) =>
          store.setState(
            produce((draft) => {
              draft.profile.personality = value || undefined
            }),
          ),
        { wait: 500 },
      ),
    [store],
  )

  const saveRunNotes = useMemo(
    () =>
      new Debouncer(
        (value: string) =>
          store.setState(
            produce((draft) => {
              draft.profile.runNotes = value || undefined
            }),
          ),
        { wait: 500 },
      ),
    [store],
  )

  useEffect(
    () => () => {
      saveDescription.flush()
      savePersonality.flush()
      saveRunNotes.flush()
    },
    [saveDescription, savePersonality, saveRunNotes],
  )

  return (
    <Stack sx={{ height: "100%", flexGrow: 1 }}>
      <Stack>
        <SectionHeader id="description-label">Background / Description</SectionHeader>
        <TextField
          multiline
          minRows={4}
          variant="outlined"
          placeholder="Character background, appearance, and history..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            saveDescription.maybeExecute(e.target.value)
          }}
          onBlur={() => saveDescription.flush()}
          fullWidth
          slotProps={{ htmlInput: { "aria-labelledby": "description-label" } }}
        />
      </Stack>

      <Stack>
        <SectionHeader id="personality-label">Personality</SectionHeader>
        <TextField
          multiline
          minRows={3}
          variant="outlined"
          placeholder="Character traits, quirks, and behavioral notes..."
          value={personality}
          onChange={(e) => {
            setPersonality(e.target.value)
            savePersonality.maybeExecute(e.target.value)
          }}
          onBlur={() => savePersonality.flush()}
          fullWidth
          slotProps={{ htmlInput: { "aria-labelledby": "personality-label" } }}
        />
      </Stack>

      <Stack sx={{ flexGrow: 1 }}>
        <SectionHeader id="run-notes-label">Run Notes</SectionHeader>

        <TextField
          multiline
          minRows={8}
          variant="outlined"
          placeholder="Jot down session notes, NPC names, temporary status effects..."
          value={runNotes}
          onChange={(e) => {
            setRunNotes(e.target.value)
            saveRunNotes.maybeExecute(e.target.value)
          }}
          onBlur={() => saveRunNotes.flush()}
          fullWidth
          sx={{
            "flexGrow": 1,
            "& .MuiInputBase-root": {
              fontFamily: "monospace",
              alignItems: "flex-start",
              height: "100%",
            },
          }}
          slotProps={{ htmlInput: { "aria-labelledby": "run-notes-label" } }}
        />
      </Stack>
    </Stack>
  )
}
