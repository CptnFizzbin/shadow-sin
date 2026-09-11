import { produce } from "immer"

import type { WorkflowState } from "./workflowContext.ts"

export type WorkflowAction<TData extends object, TSteps extends string> =
  | { type: "updateData", updater: (data: TData) => TData | void }
  | { type: "setData", data: TData }
  | { type: "nextStep", step: TSteps }
  | { type: "previousStep" }
  | { type: "reset", state: WorkflowState<TData, TSteps> }

export const workflowReducer = <TData extends object, TSteps extends string>(state: WorkflowState<TData, TSteps>, action: WorkflowAction<TData, TSteps>) => {
  return produce(state, (draft): WorkflowState<TData, TSteps> => {
    switch (action.type) {
      case "previousStep":
        if (draft.previousSteps.length >= 1) {
          draft.currentStep = draft.previousSteps.pop()!
        }
        break
      case "setData":
        draft.data = action.data
        break
      case "updateData":
        draft.data = produce(draft.data, action.updater)
        break
      case "nextStep":
        draft.previousSteps.push(draft.currentStep)
        draft.currentStep = action.step
        break
      case "reset":
        return action.state
    }

    return draft
  })
}
