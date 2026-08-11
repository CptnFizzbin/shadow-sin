import { act, renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { MatrixNodeData } from "#/system/matrix/matrixNodeData.ts"
import { NodeType } from "#/system/matrix/nodeType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { useMatrixSelector } from "./matrixSelector.ts"

const makeNode = (system: number): MatrixNodeData => ({
  id: "node-1",
  name: "Test Host",
  nodeType: NodeType.general,
  matrix: { [AttributeKey.system]: system },
})

describe("useMatrixSelector", () => {
  it("resolves a damage track relative to the given MatrixNode's System rating", () => {
    // Arrange
    const store = new RunnerDataStore(runnerDataFactory((s) => {
      s.damage.matrix = 2
      return s
    }))
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )
    const activeNode = makeNode(4)

    // Act
    const { result } = renderHook(
      () => useMatrixSelector(activeNode, ({ damage }) => damage.track),
      { wrapper: Wrapper },
    )

    // Assert — max = 8 + ceil(system / 2) = 8 + 2 = 10
    expect(result.current).toEqual({ max: 10, current: 2, woundInterval: 3 })
  })

  it("reacts to the underlying runner store, same as useRunnerSelector", () => {
    // Arrange
    const store = new RunnerDataStore(runnerDataFactory((s) => {
      s.damage.matrix = 0
      return s
    }))
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )
    const activeNode = makeNode(0)

    const { result } = renderHook(
      () => useMatrixSelector(activeNode, ({ damage }) => damage.track),
      { wrapper: Wrapper },
    )
    expect(result.current.current).toBe(0)

    // Act
    act(() => {
      store.setState((prev) => ({ ...prev, damage: { ...prev.damage, matrix: 3 } }))
    })

    // Assert
    expect(result.current.current).toBe(3)
  })
})
