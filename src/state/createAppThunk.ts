import { createAsyncThunk } from "@reduxjs/toolkit"

import type { AppState } from "./rootState.ts"

export const createThunk = createAsyncThunk.withTypes<{ state: AppState }>()
