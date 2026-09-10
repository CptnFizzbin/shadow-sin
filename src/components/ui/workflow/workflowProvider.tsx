import type { PropsWithChildren } from "react"
import { useMemo, useReducer } from "react"

import type { Workflow } from "./createWorkflow.tsx"
import type { WorkflowCtrl } from "./workflowContext.ts"
import { workflowReducer } from "./workflowReducer.tsx"

interface WorkflowProviderProps<TData extends object> extends PropsWithChildren {
  workflow: Workflow<TData>
  initialData: TData
  initialStep: string
  previousSteps?: string[]
}

export const WorkflowProvider = <TData extends object, TSteps extends string>(props: WorkflowProviderProps<TData>) => {
  const { workflow, initialData, initialStep, previousSteps = [], children } = props
  const Provider = workflow.context.Provider

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
