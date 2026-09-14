import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/runnerDataStore.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { AttrDecrementButton } from "./attrDecrementButton.tsx"
import { AttrIncrementButton } from "./attrIncrementButton.tsx"

describe("AttrIncrementButton", () => {
  it("raises the first attribute to its maximum while Essence is full", () => {
    // Arrange
    const runnerStore = new RunnerDataStore(runnerDataFactory({
      afterBuild: (runner) => {
        runner.attributes[AttributeKey.body] = 5
        runner.attributes[AttributeKey.essence] = 6
      },
    }))
    renderInBuilder(<AttrIncrementButton attr={AttributeKey.body} />, { runnerStore })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(runnerStore.getState().attributes[AttributeKey.body]).toBe(6)
    expect(runnerStore.getState().attributes[AttributeKey.essence]).toBe(6)
    expect(screen.getByRole("button", { name: "MAX" }).hasAttribute("disabled")).toBe(true)
  })

  it("prevents a second purchased attribute from reaching its maximum", () => {
    // Arrange
    const runnerStore = new RunnerDataStore(runnerDataFactory({
      afterBuild: (runner) => {
        runner.attributes[AttributeKey.body] = 6
        runner.attributes[AttributeKey.logic] = 5
      },
    }))
    renderInBuilder(<AttrIncrementButton attr={AttributeKey.logic} />, { runnerStore })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(runnerStore.getState().attributes[AttributeKey.logic]).toBe(5)
    expect(screen.getByRole("button", { name: "---" }).hasAttribute("disabled")).toBe(true)
  })

  it("allows a different attribute to reach its maximum after lowering the first", () => {
    // Arrange
    const runnerStore = new RunnerDataStore(runnerDataFactory({
      afterBuild: (runner) => {
        runner.attributes[AttributeKey.body] = 6
        runner.attributes[AttributeKey.logic] = 5
      },
    }))
    renderInBuilder(
      <>
        <AttrDecrementButton attr={AttributeKey.body} />
        <AttrIncrementButton attr={AttributeKey.logic} />
      </>,
      { runnerStore },
    )

    // Act
    fireEvent.click(screen.getByRole("button", { name: "25 BP" }))
    fireEvent.click(screen.getByRole("button", { name: "25 BP" }))

    // Assert
    expect(runnerStore.getState().attributes[AttributeKey.body]).toBe(5)
    expect(runnerStore.getState().attributes[AttributeKey.logic]).toBe(6)
    expect(screen.getByRole("button", { name: "MAX" }).hasAttribute("disabled")).toBe(true)
  })
})
