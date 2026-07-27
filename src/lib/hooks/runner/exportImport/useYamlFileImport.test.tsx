import { act, renderHook, waitFor } from "@testing-library/react"
import type { ChangeEvent } from "react"
import { describe, expect, it, vi } from "vitest"

import { runnerDataToYaml } from "#/components/runner/exportImport/exportUtils.ts"
import { Artemis } from "#/data/fixtures/artemis.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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

/**
 * Builds a fake ChangeEvent carrying either a File with the given YAML
 * content, or no file at all (yamlContent === null). The input's `value` is
 * seeded with a fake path so tests can assert it gets reset.
 */
function makeChangeEvent(yamlContent: string | null): ChangeEvent<HTMLInputElement> {
  const input = document.createElement("input")
  input.type = "file"
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

function fireChange(
  result: HookWithMocks["result"],
  event: ChangeEvent<HTMLInputElement>,
) {
  act(() => {
    result.current.inputProps.onChange?.(event)
  })
}

describe("useYamlFileImport", () => {
  it("parses YAML and calls onParsed with the resulting runner", async () => {
    // Arrange
    const yaml = runnerDataToYaml(Artemis)
    const { result, onParsed, onError } = makeHookWithMocks()
    const event = makeChangeEvent(yaml)

    // Act
    fireChange(result, event)

    // Assert
    await waitFor(() => {
      expect(onParsed).toHaveBeenCalledTimes(1)
    })
    expect(onError).not.toHaveBeenCalled()
    expect((onParsed.mock.calls[0] as [RunnerData])[0].id).toBe(Artemis.id)
  })

  it("clears the input value so the same file can be re-selected", async () => {
    // Arrange
    const yaml = runnerDataToYaml(Artemis)
    const { result, onParsed } = makeHookWithMocks()
    const event = makeChangeEvent(yaml)

    // Act
    fireChange(result, event)

    // Assert
    // The reset happens synchronously, before the file is even read.
    expect(event.target.value).toBe("")
    await waitFor(() => {
      expect(onParsed).toHaveBeenCalledTimes(1)
    })
  })

  it("calls onError when the YAML cannot be parsed", async () => {
    // Arrange
    const { result, onParsed, onError } = makeHookWithMocks()
    const event = makeChangeEvent("::: not valid yaml :::\n  - [")

    // Act
    fireChange(result, event)

    // Assert
    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1)
    })
    expect(onParsed).not.toHaveBeenCalled()
  })

  it("does nothing when no file is selected", async () => {
    // Arrange
    const { result, onParsed, onError } = makeHookWithMocks()
    const event = makeChangeEvent(null)

    // Act
    fireChange(result, event)

    // Assert
    // Give any (incorrect) async work a chance to run before asserting the
    // negative, so this can't pass merely by asserting too early.
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(onParsed).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it("does not reset the input value when no file is selected", () => {
    // Arrange
    const { result } = makeHookWithMocks()
    const event = makeChangeEvent(null)

    // Act
    fireChange(result, event)

    // Assert
    expect(event.target.value).toBe("/some/path/file.yaml")
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

  it("openFilePicker is a no-op when the ref has no element yet", () => {
    // Arrange
    const { result } = makeHookWithMocks()

    // Act / Assert — should not throw
    expect(() => {
      result.current.openFilePicker()
    }).not.toThrow()
  })

  it("exposes file-input props with the expected type and accept filter", () => {
    // Arrange
    const { result } = makeHookWithMocks()

    // Assert
    expect(result.current.inputProps.type).toBe("file")
    expect(result.current.inputProps.accept).toBe(".sin,.yaml,.yml")
    expect(result.current.inputProps.ref).toBe(result.current.inputRef)
  })
})
