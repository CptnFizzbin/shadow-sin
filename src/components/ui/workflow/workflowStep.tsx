import type { FC, PropsWithChildren } from "react"
import { useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { WorkflowContext } from "./workflowContext.ts"

export interface WorkflowStepProps<TSteps extends string> extends PropsWithChildren {
  /** The step this renders `children` for — only while it's the workflow's current step. */
  step: TSteps
}

/**
 * Builds the `Step` component for a `Workflow`, closed over its `context` so it can be used as
 * `workflow.Step` without passing the workflow instance explicitly.
 */
export function createWorkflowStep<TData extends object, TSteps extends string>(
  context: WorkflowContext<TData, TSteps>,
): FC<WorkflowStepProps<TSteps>> {
  const WorkflowStep: FC<WorkflowStepProps<TSteps>> = ({ step, children }) => {
    const state = useContext(context)
    if (!state) throw new OutOfContextError("workflow", "workflow.Provider")
    return state.currentStep === step ? <>{children}</> : null
  }

  WorkflowStep.displayName = "Workflow.Step"
  return WorkflowStep
}
