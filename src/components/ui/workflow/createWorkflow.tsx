import type { FC } from "react"
import { useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { WorkflowContext } from "./workflowContext.ts"
import { createWorkflowContext } from "./workflowContext.ts"
import type { WorkflowProviderProps } from "./workflowProvider.tsx"
import { createWorkflowProvider } from "./workflowProvider.tsx"
import type { WorkflowStepProps } from "./workflowStep.tsx"
import { createWorkflowStep } from "./workflowStep.tsx"

export interface Workflow<TData extends object, TSteps extends string> {
  context: WorkflowContext<TData, TSteps>
  /** Provides the workflow's state, auto-wired to `context` — render once, above `Step`s. */
  Provider: FC<WorkflowProviderProps<TData, TSteps>>
  /** Renders `children` only while `step` is the workflow's current step. */
  Step: FC<WorkflowStepProps<TSteps>>
}

export function createWorkflow<TData extends object, TSteps extends string>(): Workflow<TData, TSteps> {
  const context = createWorkflowContext<TData, TSteps>()
  return {
    context,
    Provider: createWorkflowProvider(context),
    Step: createWorkflowStep(context),
  }
}

export function useWorkflow<TData extends object, TSteps extends string>(workflow: Workflow<TData, TSteps>) {
  const state = useContext(workflow.context)
  if (!state) throw new OutOfContextError("workflow", "workflow.Provider")
  return state
}
