import TextField from "@mui/material/TextField"
import type { FC } from "react"

import { NotesActions } from "#/state/runner/notes/notes.actions.ts"
import { NotesSelectors } from "#/state/runner/notes/notes.selector.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

/** Free-form text box for the Runner's general notes, saved as the player types. */
export const NotesTextSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const notes = useRunnerSelector(NotesSelectors.select)

  return (
    <TextField
      label="Notes"
      fullWidth
      multiline
      minRows={6}
      variant="outlined"
      size="small"
      value={notes}
      onChange={(event) => dispatch(NotesActions.set(event.target.value))}
    />
  )
}
