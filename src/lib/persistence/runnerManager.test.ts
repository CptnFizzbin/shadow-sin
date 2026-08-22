import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeTestRunnerManager } from "#testUtils/storage/makeTestRunnerManager.ts"

import { RunnerManager } from "./runnerManager.ts"

describe.concurrent("RunnerManager.listRunnersWithErrors", () => {
  it("returns an empty result when storage is empty", async () => {
    // Arrange
    const { manager } = makeTestRunnerManager()

    // Act
    const result = await manager.listRunnersWithErrors()

    // Assert
    expect(result.runners).toEqual({})
    expect(result.errors).toEqual([])
  })

  it("surfaces an error entry for a runner with a missing version", async () => {
    // Arrange
    const { manager: localManager, storage } = makeTestRunnerManager()
    await storage.setItem("index", [{ id: "bad-id", name: "bad", lastModified: "2024-01-01T00:00:00.000Z" }])
    await storage.setItem("characters/bad-id", {})

    // Act
    const result = await localManager.listRunnersWithErrors()

    // Assert
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].runnerId).toBe("bad-id")
    expect(result.runners).toEqual({})
  })

  it("surfaces an error entry for a runner with an invalid version string", async () => {
    // Arrange
    const { manager: localManager, storage } = makeTestRunnerManager()
    await storage.setItem("index", [{ id: "bad-version", name: "bad", lastModified: "2024-01-01T00:00:00.000Z" }])
    await storage.setItem("characters/bad-version", { version: "foobar" })

    // Act
    const result = await localManager.listRunnersWithErrors()

    // Assert
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].runnerId).toBe("bad-version")
  })

  it("does not crash listRunners when one runner is invalid", async () => {
    // Arrange
    const { manager: localManager, storage } = makeTestRunnerManager()
    await storage.setItem("index", [{ id: "bad", name: "bad", lastModified: "2024-01-01T00:00:00.000Z" }])
    await storage.setItem("characters/bad", {})

    // Act
    const runners = await localManager.listRunners()

    // Assert — listRunners reads from index, not by scanning; the runner is in the index
    expect(runners).toHaveLength(1)
    expect(runners[0].id).toBe("bad")
    // The entry appears in the index but loading it throws because the stored data is invalid
    await expect(localManager.getRunner("bad")).rejects.toThrow()
  })
})

describe.concurrent("RunnerManager.saveRunner / getRunner", () => {
  it("persists the runner so getRunner returns it immediately after saveRunner resolves", async () => {
    // Arrange
    const { manager } = makeTestRunnerManager()
    const runner = { ...runnerDataFactory(), id: crypto.randomUUID() }

    // Act
    await manager.saveRunner(runner)

    // Assert
    const loaded = await manager.getRunner(runner.id)
    expect(loaded).not.toBeNull()
    expect(loaded.id).toBe(runner.id)
  })

  it("throws RunnerNotFoundError for an unknown runner id", async () => {
    // Arrange
    const { manager } = makeTestRunnerManager()
    const unknownId = crypto.randomUUID()

    // Act / Assert
    await expect(manager.getRunner(unknownId)).rejects.toThrow("Runner not found")
  })
})

describe.concurrent("RunnerManager.listRunners", () => {
  it("returns saved runner metadata from the index", async () => {
    // Arrange
    const { manager } = makeTestRunnerManager()
    const runner = { ...runnerDataFactory(), id: crypto.randomUUID() }

    // Act
    await manager.saveRunner(runner)
    const list = await manager.listRunners()

    // Assert
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe(runner.id)
    expect(list[0].name).toBe(runner.profile.alias)
  })
})

describe.concurrent("RunnerManager.deleteRunner", () => {
  it("removes the runner so subsequent getRunner throws", async () => {
    // Arrange
    const { manager } = makeTestRunnerManager()
    const runner = { ...runnerDataFactory(), id: crypto.randomUUID() }
    await manager.saveRunner(runner)

    // Act
    await manager.deleteRunner(runner.id)

    // Assert
    await expect(manager.getRunner(runner.id)).rejects.toThrow("Runner not found")
  })
})

describe.concurrent("RunnerManager.save (debounced)", () => {
  it("debounces rapid saves so only the last value is persisted to storage", async () => {
    // Arrange
    const { manager: writingManager, storage } = makeTestRunnerManager()
    const runner = { ...runnerDataFactory(), id: crypto.randomUUID() }
    const first = { ...runner, profile: { ...runner.profile, alias: "first" } }
    const second = { ...runner, profile: { ...runner.profile, alias: "second" } }
    const third = { ...runner, profile: { ...runner.profile, alias: "third" } }

    // Act: fire three saves synchronously before any timer fires
    const saves = Promise.all([
      writingManager.save(first),
      writingManager.save(second),
      writingManager.save(third),
    ])
    await saves

    // Assert — only the last alias reaches storage; bypass the cache with a fresh manager
    const freshManager = new RunnerManager({ local: storage }, 0)
    const loaded = await freshManager.getRunner(runner.id)
    expect(loaded.profile.alias).toBe("third")
  })
})
