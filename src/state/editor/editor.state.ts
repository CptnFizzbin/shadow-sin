import type { RunnerData } from "#data/runner/runnerData.ts"

export interface EditorState {
  original: RunnerData
}

export const editorStateFactory = (runner: RunnerData): EditorState => {
  return {
    original: runner,
  }
}
