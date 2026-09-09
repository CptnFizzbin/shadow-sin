import { fireEvent, render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import type { RunnerFactoryAfterBuildFn } from "#/system/runnerData.factory.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { AttrDecrementButton } from "./attrDecrementButton.tsx"

function renderButton(attr: AttributeKey, afterBuild: RunnerFactoryAfterBuildFn) {
  const runnerData = runnerDataFactory({ afterBuild })
  const store = new RunnerDataStore(runnerData)

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
    expect(store.getState().attributes[AttributeKey.charisma]).toBe(2)
  })

  it("leaves Edge alone when it's already within the new Rating", () => {
    // Arrange: Rating = ceil(avg(4, 4, 4, 4)) = 4; Edge sits well below that.
    const store = renderButton(AttributeKey.charisma, (data) => {
      data.biology.metatype = MetatypeType.AI
      data.biology.awakening = AwakeningType.None
      data.attributes[AttributeKey.charisma] = 4
      data.attributes[AttributeKey.intuition] = 4
      data.attributes[AttributeKey.logic] = 4
      data.attributes[AttributeKey.willpower] = 4
      data.attributes[AttributeKey.edge] = 1
    })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(store.getState().attributes[AttributeKey.edge]).toBe(1)
  })

  it("doesn't touch Edge for a non-AI metatype", () => {
    // Arrange
    const store = renderButton(AttributeKey.charisma, (data) => {
      data.biology.metatype = MetatypeType.Human
      data.attributes[AttributeKey.charisma] = 4
      data.attributes[AttributeKey.edge] = 6
    })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(store.getState().attributes[AttributeKey.edge]).toBe(6)
  })
})
