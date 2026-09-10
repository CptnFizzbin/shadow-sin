import { useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { WorkflowContext } from "./workflowContext.ts"
import { createWorkflowContext } from "./workflowContext.ts"

export interface Workflow<TData extends object, TSteps extends string> {
  context: WorkflowContext<TData, TSteps>
}

export function createWorkflow<TData extends object, TSteps extends string>(): Workflow<TData, TSteps> {
  return { context: createWorkflowContext() }
}

export function useWorkflow<TData extends object, TSteps extends string>(workflow: Workflow<TData, TSteps>) {
  const state = useContext(workflow.context)
  if (!state) throw new OutOfContextError("workflow", "workflow.Provider")
  return state
}
