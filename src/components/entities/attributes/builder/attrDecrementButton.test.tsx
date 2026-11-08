import { fireEvent, render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { MetatypeType } from "#/system/model/biology/metatypeData.ts"
import { AwakeningType } from "#/system/model/magic/awakeningType.ts"
import type { RunnerFactoryAfterBuildFn } from "#/system/model/runnerData.factory.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { AttrDecrementButton } from "./attrDecrementButton.tsx"

function renderButton(attr: AttributeKey, afterBuild: RunnerFactoryAfterBuildFn) {
  const runnerData = runnerDataFactory({ afterBuild })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<AttrDecrementButton attr={attr} />, { wrapper: Wrapper })

  return store
}

describe("AttrDecrementButton", () => {
  it("decrements the attribute's stored value", () => {
    // Arrange
    const store = renderButton(AttributeKey.charisma, (data) => {
      data.attributes[AttributeKey.charisma] = 3
    })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(store.getState().runner.attributes[AttributeKey.charisma]).toBe(2)
  })

  it("leaves Edge alone when it's already within the new Rating", () => {
    // Arrange: Rating drops from ceil(17 / 4) = 5 to ceil(16 / 4) = 4, landing exactly on Edge.
    const store = renderButton(AttributeKey.charisma, (data) => {
      data.biology.metatype = MetatypeType.AI
      data.biology.awakening = AwakeningType.None
      data.attributes[AttributeKey.charisma] = 5
      data.attributes[AttributeKey.intuition] = 4
      data.attributes[AttributeKey.logic] = 4
      data.attributes[AttributeKey.willpower] = 4
      data.attributes[AttributeKey.edge] = 4
    })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(store.getState().runner.attributes[AttributeKey.charisma]).toBe(4)
    expect(store.getState().runner.attributes[AttributeKey.edge]).toBe(4)
  })

  it("doesn't touch Edge for a non-AI metatype", () => {
    // Arrange: an AI-style Rating here would be ceil(4 / 4) = 1 after the decrement, far below Edge.
    const store = renderButton(AttributeKey.charisma, (data) => {
      data.biology.metatype = MetatypeType.Human
      data.attributes[AttributeKey.charisma] = 2
      data.attributes[AttributeKey.intuition] = 1
      data.attributes[AttributeKey.logic] = 1
      data.attributes[AttributeKey.willpower] = 1
      data.attributes[AttributeKey.edge] = 6
    })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(store.getState().runner.attributes[AttributeKey.charisma]).toBe(1)
    expect(store.getState().runner.attributes[AttributeKey.edge]).toBe(6)
  })
})
