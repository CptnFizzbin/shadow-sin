import { createAction, createAsyncThunk } from "@reduxjs/toolkit"

import type { AppState } from "#/state/rootState.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { NumberUtils } from "#/utils/numberUtils.ts"

export const setCurrentEdge = createAsyncThunk<number, number, {
  state: AppState
}>("edge/set", (amount, { getState }) => {
  const sheet = getState().runner

  return NumberUtils.clamp(amount, {
    min: 0,
    max: AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge }),
  })
})

export const spendEdge = createAsyncThunk<void, number, {
  state: AppState
}>("edge/spend", (amount, { dispatch, getState }) => {
  const sheet = getState().runner

  dispatch(setCurrentEdge(
    NumberUtils.clamp(amount, { max: sheet.edge.current }),
  ))
})

export const restoreAllEdge = createAsyncThunk<void, void, {
  state: AppState
}>("edge/restoreAllEdge", (_, { dispatch, getState }) => {
  const sheet = getState().runner

  dispatch(
    setCurrentEdge(AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge })),
  )
})

export const restoreEdge = createAsyncThunk<void, number, {
  state: AppState
}>("edge/restore", (amount, { dispatch, getState }) => {
  const sheet = getState().runner
  const maxEdge = AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge })
  const current = sheet.edge.current

  dispatch(setCurrentEdge(
    NumberUtils.clamp(amount, { max: maxEdge - current }),
  ))
})

export const burnEdge = createAction("edge/burn")
