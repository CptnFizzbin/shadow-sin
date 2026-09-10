import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { createWorkflow, useWorkflow } from "./createWorkflow.tsx"

type Steps = "intro" | "details" | "review"

interface Data {
  name: string
}

const workflow = createWorkflow<Data, Steps>()

const NextButton = ({ step }: { step: Steps }) => {
  const { next } = useWorkflow(workflow)
  return <button onClick={() => next(step)}>Go to {step}</button>
}

const BackButton = () => {
  const { back } = useWorkflow(workflow)
  return <button onClick={() => back()}>Back</button>
}

const renderWorkflow = () =>
  render(
    <workflow.Provider initialData={{ name: "" }} initialStep="intro">
      <div>
        <workflow.Step step="intro">
          <div>Intro content</div>
          <NextButton step="details" />
        </workflow.Step>
        <div>
          <workflow.Step step="details">
            <div>Details content</div>
            <BackButton />
            <NextButton step="review" />
          </workflow.Step>
        </div>
        <workflow.Step step="review">
          <div>Review content</div>
        </workflow.Step>
      </div>
    </workflow.Provider>,
  )

describe("Workflow", () => {
  it("renders only the initial step's children", () => {
    // Arrange
    // Act
    renderWorkflow()

    // Assert
    expect(screen.getByText("Intro content")).toBeDefined()
    expect(screen.queryByText("Details content")).toBeNull()
    expect(screen.queryByText("Review content")).toBeNull()
  })

  it("switches to the next step, however deeply nested, when next() is called", () => {
    // Arrange
    renderWorkflow()

    // Act
    fireEvent.click(screen.getByText("Go to details"))

    // Assert
    expect(screen.getByText("Details content")).toBeDefined()
    expect(screen.queryByText("Intro content")).toBeNull()
  })

  it("returns to the previous step when back() is called", () => {
    // Arrange
    renderWorkflow()
    fireEvent.click(screen.getByText("Go to details"))

    // Act
    fireEvent.click(screen.getByText("Back"))

    // Assert
    expect(screen.getByText("Intro content")).toBeDefined()
    expect(screen.queryByText("Details content")).toBeNull()
  })

  it("tracks visited steps across multiple next() calls", () => {
    // Arrange
    renderWorkflow()
    fireEvent.click(screen.getByText("Go to details"))

    // Act
    fireEvent.click(screen.getByText("Go to review"))

    // Assert
    expect(screen.getByText("Review content")).toBeDefined()
    expect(screen.queryByText("Details content")).toBeNull()
    expect(screen.queryByText("Intro content")).toBeNull()
  })
})
