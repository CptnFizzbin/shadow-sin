import type { FC, PropsWithChildren } from "react"
import { useMemo, useReducer } from "react"

import type { WorkflowContext, WorkflowCtrl } from "./workflowContext.ts"
import { workflowReducer } from "./workflowReducer.tsx"

export interface WorkflowProviderProps<TData extends object, TSteps extends string> extends PropsWithChildren {
  initialData: TData
  initialStep: TSteps
  previousSteps?: TSteps[]
}

/**
 * Builds the `Provider` component for a `Workflow`, closed over its `context` so it can be used
 * as `workflow.Provider` without passing the workflow instance explicitly.
 */
export function createWorkflowProvider<TData extends object, TSteps extends string>(
  context: WorkflowContext<TData, TSteps>,
): FC<WorkflowProviderProps<TData, TSteps>> {
  const WorkflowProvider: FC<WorkflowProviderProps<TData, TSteps>> = (props) => {
    const { initialData, initialStep, previousSteps = [], children } = props
    const Provider = context.Provider

    const [state, dispatch] = useReducer(workflowReducer, {
      currentStep: initialStep,
      previousSteps: previousSteps,
      data: initialData,
    })

    const ctrl = useMemo((): WorkflowCtrl<TData, TSteps> => ({
      setData: (dataOrUpdater: TData | ((data: TData) => TData)) => {
        if (typeof dataOrUpdater === "function") {
          const updater = dataOrUpdater
          dispatch({ type: "updateData", updater })
        } else {
          const data = dataOrUpdater
          dispatch({ type: "setData", data })
        }
      },
      back: () => void dispatch({ type: "previousStep" }),
      next: (step: TSteps) => void dispatch({ type: "nextStep", step }),
    }), [dispatch])

    const contextValue = useMemo(() => ({
      ...state,
      ...ctrl,
    }), [state, ctrl])

    return (
      <Provider value={contextValue}>{children}</Provider>
    )
  }

  WorkflowProvider.displayName = "Workflow.Provider"
  return WorkflowProvider
}
