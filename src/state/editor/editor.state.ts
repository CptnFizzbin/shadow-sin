import type { RunnerData } from "#/system/model/runnerData.ts"

export interface EditorState {
  original: RunnerData
}

export const editorStateFactory = (runner: RunnerData): EditorState => {
  return {
    original: runner,
  }
}
