import { createAction } from "@reduxjs/toolkit"

import type { BuilderState } from "./builderState.ts"

export const BuilderActions = {
  reset: createAction("builder/reset"),

  setState: createAction<BuilderState>("builder/set"),

  nuyen: {
    setStartingNuyen: createAction<number | null>("builder/setStartingNuyen"),
  },
}
