import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

type EditorModeValue = "builder" | "edit"

// Defaults to "builder" so components that render outside an explicit provider
// (e.g. in isolation in tests) keep their original character-creation behavior.
const EditorModeContext = createContext<EditorModeValue>("builder")

export const EditorModeProvider: FC<PropsWithChildren<{ mode: EditorModeValue }>> = ({ mode, children }) => (
  <EditorModeContext.Provider value={mode}>{children}</EditorModeContext.Provider>
)

export interface EditorModeInfo {
  isBuilder: boolean
  isEdit: boolean
}

export const useEditorMode = (): EditorModeInfo => {
  const mode = useContext(EditorModeContext)

  return {
    isBuilder: mode === "builder",
    isEdit: mode === "edit",
  }
}

const IsBuilder: FC<PropsWithChildren> = ({ children }) => {
  const editorMode = useEditorMode()
  return editorMode.isBuilder ? children : null
}

const IsEdit: FC<PropsWithChildren> = ({ children }) => {
  const editorMode = useEditorMode()
  return editorMode.isEdit ? children : null
}

export const EditorMode = { IsBuilder, IsEdit }
