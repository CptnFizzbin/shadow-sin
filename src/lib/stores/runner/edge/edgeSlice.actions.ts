import { createAction, createAsyncThunk } from "@reduxjs/toolkit"

import { NumberUtils } from "#/lib/numberUtils.ts"
import { forAttr } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const setCurrentEdge = createAsyncThunk<number, number, {
  state: RunnerData
}>("edge/set", (amount, { getState }) => {
  const sheet = getState()

  return NumberUtils.clamp(amount, {
    min: 0,
    max: forAttr(AttributeKey.edge).baseValue(sheet) ?? 0,
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
    setCurrentEdge(forAttr(AttributeKey.edge).baseValue(sheet) ?? 0),
  )
})

export const restoreEdge = createAsyncThunk<void, number, {
  state: RunnerData
}>("edge/restore", (amount, { dispatch, getState }) => {
  const sheet = getState()
  const maxEdge = forAttr(AttributeKey.edge).baseValue(sheet) ?? 0
  const current = sheet.edge.current

  dispatch(setCurrentEdge(
    NumberUtils.clamp(amount, { max: maxEdge - current }),
  ))
})

export const burnEdge = createAction("edge/burn")
