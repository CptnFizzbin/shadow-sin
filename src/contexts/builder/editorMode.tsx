import type { FC, PropsWithChildren } from "react"

import { useRunnerState } from "#/state/runnerState.ts"

export interface EditorModeInfo {
  isViewer: boolean
  isBuilder: boolean
  isEdit: boolean
}

export const useEditorMode = (): EditorModeInfo => {
  const mode = useRunnerState((state) => state.mode)

  return {
    isViewer: mode === "viewer",
    isBuilder: mode === "builder",
    isEdit: mode === "editor",
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

export const EditorMode = {
  IsBuilder,
  IsEdit,
}
