import { describe, expect, it } from "vitest"

import type { WorkflowState } from "./workflowContext.ts"
import { workflowReducer } from "./workflowReducer.tsx"

type TestStep = "first" | "second" | "third"

const stateFor = (overrides: Partial<WorkflowState<{ label: string }, TestStep>> = {}): WorkflowState<{ label: string }, TestStep> => ({
  currentStep: "first",
  previousSteps: [],
  data: { label: "initial" },
  ...overrides,
})

describe("workflowReducer", () => {
  it("moves to the given step on nextStep, pushing the current one onto previousSteps", () => {
    // Arrange
    const state = stateFor()

    // Act
    const next = workflowReducer(state, { type: "nextStep", step: "second" })

    // Assert
    expect(next.currentStep).toBe("second")
    expect(next.previousSteps).toEqual(["first"])
  })

  it("pops the last previous step on previousStep", () => {
    // Arrange
    const state = stateFor({ currentStep: "second", previousSteps: ["first"] })

    // Act
    const prev = workflowReducer(state, { type: "previousStep" })

    // Assert
    expect(prev.currentStep).toBe("first")
    expect(prev.previousSteps).toEqual([])
  })

  it("is a no-op on previousStep when there's no history", () => {
    // Arrange
    const state = stateFor()

    // Act
    const prev = workflowReducer(state, { type: "previousStep" })

    // Assert
    expect(prev.currentStep).toBe("first")
    expect(prev.previousSteps).toEqual([])
  })

  it("replaces data on setData", () => {
    // Arrange
    const state = stateFor()

    // Act
    const next = workflowReducer(state, { type: "setData", data: { label: "replaced" } })

    // Assert
    expect(next.data).toEqual({ label: "replaced" })
  })

  it("applies an updater function on updateData", () => {
    // Arrange
    const state = stateFor()

    // Act
    const next = workflowReducer(state, {
      type: "updateData",
      updater: (data) => ({ label: `${data.label}-updated` }),
    })

    // Assert
    expect(next.data).toEqual({ label: "initial-updated" })
  })

  it("leaves the original state untouched (immer draft, not a mutation)", () => {
    // Arrange
    const state = stateFor()

    // Act
    workflowReducer(state, { type: "nextStep", step: "second" })

    // Assert
    expect(state.currentStep).toBe("first")
    expect(state.previousSteps).toEqual([])
  })
})
