import { describe, expect, it } from "vitest"

import { NotesActions } from "./notes.actions.ts"
import { notesReducer } from "./notes.state.ts"

describe.concurrent("NotesActions.set", () => {
  it("replaces the Runner's notes", () => {
    // Arrange
    const state = "Owes Mr. Johnson a favor"

    // Act
    const next = notesReducer(state, NotesActions.set("Safehouse in Redmond"))

    // Assert
    expect(next).toBe("Safehouse in Redmond")
  })
})
