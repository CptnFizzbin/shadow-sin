import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

describe("useRunnerSelector — attribute namespace", () => {
  it("reads an attribute's base value from the runner sheet", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.attributes.body = 5
      return s
    })

    // Act
    const { result } = renderHook(
      () => useRunnerSelector(({ attribute }) => attribute(AttributeKey.body).baseValue),
      { wrapper: makeRunnerDataWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(5)
  })

  it("reads an attribute's info alongside its base value", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const { result } = renderHook(
      () => useRunnerSelector(({ attribute }) => attribute(AttributeKey.body).info),
      { wrapper: makeRunnerDataWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBeDefined()
  })

  it("defaults an unset attribute (e.g. a Matrix stat on a Runner) to 0", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const { result } = renderHook(
      () => useRunnerSelector(({ attribute }) => attribute(AttributeKey.system).baseValue),
      { wrapper: makeRunnerDataWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(0)
  })
})
