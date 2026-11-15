import { createAction } from "@reduxjs/toolkit"

export const setNotes = createAction<string>("notes/set")

export const NotesActions = {
  set: setNotes,
}
