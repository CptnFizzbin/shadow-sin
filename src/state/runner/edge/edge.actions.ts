import { createAction, createAsyncThunk } from "@reduxjs/toolkit"

import { NumberUtils } from "#common/number/numberUtils.ts"
import { AttributeKey } from "#data/attributes/attributeKey.ts"
import { AttrSelectors } from "#state/runner/attributes/attributes.selector.ts"
import type { RunnerState } from "#state/runnerState.ts"

export const setCurrentEdge = createAsyncThunk<number, number, {
  state: RunnerState
}>("edge/set", (amount, { getState }) => {
  const sheet = getState().runner

  return NumberUtils.clamp(amount, {
    min: 0,
    max: AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge }),
  })
})

export const spendEdge = createAsyncThunk<void, number, {
  state: RunnerState
}>("edge/spend", (amount, { dispatch, getState }) => {
  const sheet = getState().runner

  dispatch(setCurrentEdge(
    NumberUtils.clamp(amount, { max: sheet.edge.current }),
  ))
})

export const restoreAllEdge = createAsyncThunk<void, void, {
  state: RunnerState
}>("edge/restoreAllEdge", (_, { dispatch, getState }) => {
  const sheet = getState().runner

  dispatch(
    setCurrentEdge(AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge })),
  )
})

export const restoreEdge = createAsyncThunk<void, number, {
  state: RunnerState
}>("edge/restore", (amount, { dispatch, getState }) => {
  const sheet = getState().runner
  const maxEdge = AttrSelectors.selectBase({ entity: sheet }, { key: AttributeKey.edge })
  const current = sheet.edge.current

  dispatch(setCurrentEdge(
    NumberUtils.clamp(amount, { max: maxEdge - current }),
  ))
})

export const burnEdge = createAction("edge/burn")
