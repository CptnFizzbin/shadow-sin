import { createAction, createAsyncThunk } from "@reduxjs/toolkit"

import { NumberUtils } from "#/lib/numberUtils.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const setCurrentEdge = createAsyncThunk<number, number, {
  state: RunnerData
}>("edge/set", (amount, { getState }) => {
  const sheet = getState()

  return NumberUtils.clamp(amount, {
    min: 0,
    max: AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge }),
  })
})

export const spendEdge = createAsyncThunk<void, number, {
  state: RunnerData
}>("edge/spend", (amount, { dispatch, getState }) => {
  const sheet = getState()

  dispatch(setCurrentEdge(
    NumberUtils.clamp(amount, { max: sheet.edge.current }),
  ))
})

export const restoreAllEdge = createAsyncThunk<void, void, {
  state: RunnerData
}>("edge/restoreAllEdge", (_, { dispatch, getState }) => {
  const sheet = getState()

  dispatch(
    setCurrentEdge(AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge })),
  )
})

export const restoreEdge = createAsyncThunk<void, number, {
  state: RunnerData
}>("edge/restore", (amount, { dispatch, getState }) => {
  const sheet = getState()
  const maxEdge = AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge })
  const current = sheet.edge.current

  dispatch(setCurrentEdge(
    NumberUtils.clamp(amount, { max: maxEdge - current }),
  ))
})

export const burnEdge = createAction("edge/burn")
