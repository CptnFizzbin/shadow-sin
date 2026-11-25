import type { Draft } from "immer"
import type { Context } from "react"
import { createContext } from "react"

export interface WorkflowState<TData extends object, TSteps extends string> {
  previousSteps: TSteps[]
  currentStep: TSteps
  data: TData
}

export interface WorkflowCtrl<TData extends object, TSteps extends string> {
  readonly isFirstStep: boolean

  setData(data: TData): void

  setData(updater: (data: Draft<TData> | TData) => TData | void): void

  back(): void

  next(step: TSteps): void
}

export type WorkflowContextData<TData extends object, TSteps extends string> =
  & WorkflowState<TData, TSteps>
  & WorkflowCtrl<TData, TSteps>

export type WorkflowContext<TData extends object, TSteps extends string> =
  Context<WorkflowContextData<TData, TSteps> | null>

export function createWorkflowContext<TData extends object, TSteps extends string>(): WorkflowContext<TData, TSteps> {
  return createContext<WorkflowContextData<TData, TSteps> | null>(null)
}
