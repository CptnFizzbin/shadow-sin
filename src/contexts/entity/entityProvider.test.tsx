import { renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { EntityProvider, useEntitySelector } from "./entityProvider.tsx"

// `useEntitySelector` also resolves the Runner's own item catalog (for selectors like
// `ItemSelectors.selectByFilter`), so every test here needs a `RunnerStoreProvider` in scope even
// when the selector under test only reads `entity` — matching how `EntityProvider` is always used
// in the app (nested under `RunnerStoreProvider`, per its own doc comment).
const wrapperFor = (entity: object): FC<PropsWithChildren> => {
  const runnerStore = new RunnerDataStore(runnerDataFactory())
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={runnerStore}>
      <EntityProvider entity={entity}>{children}</EntityProvider>
    </RunnerStoreProvider>
  )
  return Wrapper
}

describe("useEntitySelector", () => {
  it("throws when rendered outside an EntityProvider", () => {
    // Arrange
    const render = () => renderHook(() => useEntitySelector(AttrSelectors.selectAll))

    // Act / Assert
    expect(render).toThrow("useEntitySelector must be used within EntityProvider")
  })

  it("applies a no-options selector against the nearest EntityProvider's entity", () => {
    // Arrange
    const entity = { attributes: { [AttributeKey.body]: 4 } }

    // Act
    const { result } = renderHook(() => useEntitySelector(AttrSelectors.selectAll), {
      wrapper: wrapperFor(entity),
    })

    // Assert
    expect(result.current).toEqual(expect.objectContaining(entity.attributes))
  })

  it("applies a selector's options against the nearest EntityProvider's entity", () => {
    // Arrange
    const entity = { attributes: { [AttributeKey.agility]: 5 } }

    // Act
    const { result } = renderHook(
      () => useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.agility }),
      { wrapper: wrapperFor(entity) },
    )

    // Assert
    expect(result.current).toBe(5)
  })

  it("resolves to the nearest EntityProvider, not an outer one", () => {
    // Arrange
    const outerEntity = { attributes: { [AttributeKey.strength]: 2 } }
    const innerEntity = { attributes: { [AttributeKey.strength]: 6 } }
    const runnerStore = new RunnerDataStore(runnerDataFactory())
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={runnerStore}>
        <EntityProvider entity={outerEntity}>
          <EntityProvider entity={innerEntity}>{children}</EntityProvider>
        </EntityProvider>
      </RunnerStoreProvider>
    )

    // Act
    const { result } = renderHook(
      () => useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.strength }),
      { wrapper: Wrapper },
    )

    // Assert
    expect(result.current).toBe(6)
  })
})
