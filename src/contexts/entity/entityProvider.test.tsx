import { act, renderHook } from "@testing-library/react"
import { produce } from "immer"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/sheet/runnerStoreProvider.tsx"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { EntityData } from "#/system/model/entities/entityData.ts"
import type { EntityWithAttrs } from "#/system/model/entities/traits/entityWithAttrs.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { EntityProvider, useEntitySelector } from "./entityProvider.tsx"

const wrapperFor = (entity: Partial<EntityData>): FC<PropsWithChildren> => {
  const runnerStore = new RunnerDataStore(runnerDataFactory())

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={runnerStore}>
      <EntityProvider entity={entity as EntityData}>{children}</EntityProvider>
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
    const entity: Partial<EntityData & EntityWithAttrs> = { attributes: { [AttributeKey.body]: 4 } }

    // Act
    const { result } = renderHook(() => useEntitySelector(AttrSelectors.selectAll), {
      wrapper: wrapperFor(entity as EntityData),
    })

    // Assert
    expect(result.current).toEqual(expect.objectContaining(entity.attributes))
  })

  it("applies a selector's options against the nearest EntityProvider's entity", () => {
    // Arrange
    const entity: Partial<EntityData & EntityWithAttrs> = { attributes: { [AttributeKey.agility]: 5 } }

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
    const outerEntity: Partial<EntityData & EntityWithAttrs> = { attributes: { [AttributeKey.strength]: 2 } }
    const innerEntity: Partial<EntityData & EntityWithAttrs> = { attributes: { [AttributeKey.strength]: 6 } }
    const runnerStore = new RunnerDataStore(runnerDataFactory())
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={runnerStore}>
        <EntityProvider entity={outerEntity as EntityData}>
          <EntityProvider entity={innerEntity as EntityData}>{children}</EntityProvider>
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

  it("stays in sync when the Runner store updates, via the default RunnerEntityProvider", () => {
    // Regression test: `RunnerEntityProvider` (which `useEntitySelector` falls back to when no
    // explicit `EntityProvider` is nested underneath) used to read the runner with `useRunner()`
    // calling `store.getState()` directly — a non-reactive snapshot — so selectors like
    // `AttrSelectors.selectValue` kept returning whatever attributes were current the last time
    // this subtree happened to render for some unrelated reason (e.g. never, on mount) instead of
    // the live store value. See the free Knowledge skill points calculation
    // (`useKnowledgeSkillPoints`), which silently froze at the metatype's default attributes.

    // Arrange
    const runnerStore = new RunnerDataStore(runnerDataFactory())
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={runnerStore}>{children}</RunnerStoreProvider>
    )

    const { result } = renderHook(
      () => useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.logic }),
      { wrapper: Wrapper },
    )

    expect(result.current).toBe(1) // Human metatype default

    // Act — mimic AttrIncrementButton's onClick exactly.
    act(() => {
      runnerStore.setState(produce((draft) => {
        draft.attributes[AttributeKey.logic] = 6
      }))
    })

    // Assert
    expect(result.current).toBe(6)
  })
})
