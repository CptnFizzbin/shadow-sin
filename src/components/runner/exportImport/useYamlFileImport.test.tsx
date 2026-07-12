import { act, renderHook } from "@testing-library/react"
import type { ChangeEvent } from "react"
import { describe, expect, it, vi } from "vitest"

import { Artemis } from "#/data/fixtures/artemis.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { runnerDataToYaml } from "./exportUtils.ts"
import { useYamlFileImport } from "./useYamlFileImport.ts"

interface HookWithMocks {
  result: { current: ReturnType<typeof useYamlFileImport> }
  onParsed: ReturnType<typeof vi.fn>
  onError: ReturnType<typeof vi.fn>
}

function makeHookWithMocks(): HookWithMocks {
  const onParsed = vi.fn()
  const onError = vi.fn()
  const { result } = renderHook(() => useYamlFileImport({ onParsed, onError }))
  return { result, onParsed, onError }
}

function makeChangeEvent(yamlContent: string | null): ChangeEvent<HTMLInputElement> {
  const input = document.createElement("input")
  input.type = "file"
  // Reset value via spy so we can assert it was cleared
  Object.defineProperty(input, "value", {
    writable: true,
    value: "/some/path/file.yaml",
  })

  if (yamlContent === null) {
    Object.defineProperty(input, "files", { value: null })
  } else {
    const file = new File([yamlContent], "runner.yaml", { type: "text/yaml" })
    Object.defineProperty(input, "files", { value: [file] })
  }

  return {
    target: input,
    currentTarget: input,
  } as ChangeEvent<HTMLInputElement>
}

describe("useYamlFileImport", () => {
  it("parses YAML and calls onParsed with the resulting runner", async () => {
    // Arrange
    const yaml = runnerDataToYaml(Artemis)
    const onParsed = vi.fn<(c: RunnerData) => void>()
    const onError = vi.fn()
    const { result } = renderHook(() => useYamlFileImport({ onParsed, onError }))
    const event = makeChangeEvent(yaml)

    // Act
    await act(async () => {
      await result.current.inputProps.onChange?.(event)
    })

    // Assert
    expect(onError).not.toHaveBeenCalled()
    expect(onParsed).toHaveBeenCalledTimes(1)
    expect((onParsed.mock.calls[0] as [RunnerData])[0].id).toBe(Artemis.id)
  })

  it("clears the input value so the same file can be re-selected", async () => {
    // Arrange
    const yaml = runnerDataToYaml(Artemis)
    const { result } = makeHookWithMocks()
    const event = makeChangeEvent(yaml)

    // Act
    await act(async () => {
      await result.current.inputProps.onChange?.(event)
    })

    // Assert
    expect(event.target.value).toBe("")
  })

  it("calls onError when the YAML cannot be parsed", async () => {
    // Arrange
    const { result, onParsed, onError } = makeHookWithMocks()
    const event = makeChangeEvent("::: not valid yaml :::\n  - [")

    // Act
    await act(async () => {
      await result.current.inputProps.onChange?.(event)
    })

    // Assert
    expect(onParsed).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it("does nothing when no file is selected", async () => {
    // Arrange
    const { result, onParsed, onError } = makeHookWithMocks()
    const event = makeChangeEvent(null)

    // Act
    await act(async () => {
      await result.current.inputProps.onChange?.(event)
    })

    // Assert
    expect(onParsed).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it("openFilePicker clicks the input element", () => {
    // Arrange
    const { result } = makeHookWithMocks()
    const input = document.createElement("input")
    const clickSpy = vi.spyOn(input, "click")
    result.current.inputRef.current = input

    // Act
    result.current.openFilePicker()

    // Assert
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })
})
