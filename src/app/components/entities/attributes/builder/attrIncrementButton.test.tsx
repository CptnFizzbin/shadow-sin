import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { AttrDecrementButton } from "./attrDecrementButton.tsx"
import { AttrIncrementButton } from "./attrIncrementButton.tsx"

describe("AttrIncrementButton", () => {
  it("raises the first attribute to its maximum while Essence is full", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.attributes[AttributeKey.body] = 5
        data.attributes[AttributeKey.essence] = 6
      },
    })
    const store = renderInBuilder(<AttrIncrementButton attr={AttributeKey.body} />, { runner })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(store.getState().runner.attributes[AttributeKey.body]).toBe(6)
    expect(store.getState().runner.attributes[AttributeKey.essence]).toBe(6)
    expect(screen.getByRole("button", { name: "MAX" }).hasAttribute("disabled")).toBe(true)
  })

  it("prevents a second purchased attribute from reaching its maximum", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.attributes[AttributeKey.body] = 6
        data.attributes[AttributeKey.logic] = 5
      },
    })
    const store = renderInBuilder(<AttrIncrementButton attr={AttributeKey.logic} />, { runner })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(store.getState().runner.attributes[AttributeKey.logic]).toBe(5)
    expect(screen.getByRole("button", { name: "---" }).hasAttribute("disabled")).toBe(true)
  })

  it("allows a different attribute to reach its maximum after lowering the first", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.attributes[AttributeKey.body] = 6
        data.attributes[AttributeKey.logic] = 5
      },
    })
    const store = renderInBuilder(
      <>
        <AttrDecrementButton attr={AttributeKey.body} />
        <AttrIncrementButton attr={AttributeKey.logic} />
      </>,
      { runner },
    )

    // Act
    fireEvent.click(screen.getByRole("button", { name: "25 BP" }))
    fireEvent.click(screen.getByRole("button", { name: "25 BP" }))

    // Assert
    expect(store.getState().runner.attributes[AttributeKey.body]).toBe(5)
    expect(store.getState().runner.attributes[AttributeKey.logic]).toBe(6)
    expect(screen.getByRole("button", { name: "MAX" }).hasAttribute("disabled")).toBe(true)
  })
})
