import type { UnknownAction } from "@reduxjs/toolkit"

/**
 * A synchronous analog of a Redux thunk: instead of `(dispatch, getState) => { ... }` performing
 * imperative dispatches, a `ActionChain` is a pure function of the *current* state that returns the
 * array of primitive actions to apply. Use this over a plain compound array when the actions
 * depend on state at apply-time (e.g. computing a new absolute value from the current one) rather
 * than being fully known at the call site.
 */
export type ActionChain<TState> = (state: TState) => UnknownAction[]

/**
 * A "compound" action is either a single action, a pre-computed array of actions (when nothing
 * needs to read current state to build them), or a `ActionChain` (when it does) — e.g. burning Edge
 * touches both the `edge` slice (reset current) and the `attributes` slice (permanently reduce
 * max, which requires reading the current max), which live in two different top-level `RunnerData`
 * keys and so can't be expressed as a single action for a single-key reducer.
 */
export type AnyAction<TState> = UnknownAction | UnknownAction[] | ActionChain<TState>

/**
 * Resolves `actionOrActions` against `state` (running the thunk if it is one) and folds the
 * resulting actions through `reducer` sequentially, so later actions in a batch see earlier ones'
 * effects. The caller is expected to apply the result in one `setState` call — that's what makes
 * a compound action atomic: one write, one set of subscriber notifications (autosave,
 * re-renders), not one per sub-action.
 */
export function applyActions<TState>(
  reducer: (state: TState, action: UnknownAction) => TState,
  state: TState,
  actionOrActions: AnyAction<TState>,
): TState {
  const actions = typeof actionOrActions === "function"
    ? actionOrActions(state)
    : Array.isArray(actionOrActions) ? actionOrActions : [actionOrActions]

  return actions.reduce(reducer, state)
}
