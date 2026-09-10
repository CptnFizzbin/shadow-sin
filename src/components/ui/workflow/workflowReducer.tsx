import { produce } from "immer"

import type { WorkflowState } from "./workflowContext.ts"

export type WorkflowAction<TData extends object> =
  | { type: "updateData", updater: (data: TData) => TData }
  | { type: "setData", data: TData }
  | { type: "nextStep", step: string }
  | { type: "previousStep" }
  | { type: "reset", state: WorkflowState<TData> }

export const workflowReducer = <TData extends object>(state: WorkflowState<TData>, action: WorkflowAction<TData>) => {
  return produce(state, (draft): WorkflowState<TData> => {
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
