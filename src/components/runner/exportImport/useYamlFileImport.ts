import type { ChangeEvent, InputHTMLAttributes, RefObject } from "react"
import { useRef } from "react"

import type { RunnerData } from "#/system/runnerData.ts"

import { yamlToRunnerData } from "./exportUtils.ts"

interface UseYamlFileImportOptions {
  /** Called with the parsed runner sheet after a successful YAML parse. */
  onParsed: (runner: RunnerData) => void | Promise<void>
  /** Called when YAML parsing throws. */
  onError?: (error: unknown) => void
}

interface UseYamlFileImportResult {
  /** Ref to attach to the hidden `<input type="file">`. */
  inputRef: RefObject<HTMLInputElement | null>
  /** Props to spread onto a hidden `<input type="file">` element. */
  inputProps: InputHTMLAttributes<HTMLInputElement> & {
    ref: RefObject<HTMLInputElement | null>
  }
  /** Opens the native file picker. */
  openFilePicker: () => void
}

/**
 * Shared file input handling for YAML runner imports.
 *
 * Encapsulates the hidden-input + ref + read-and-reset behaviour used by the
 * various "Import YAML" buttons across the app. Callers provide success /
 * error handlers, spread `inputProps` onto a hidden file input, and call
 * `openFilePicker` from their own trigger button.
 */
export function useYamlFileImport({
  onParsed,
  onError,
}: UseYamlFileImportOptions): UseYamlFileImportResult {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected if needed
    event.target.value = ""

    const yamlContent = await file.text()

    let runner: RunnerData
    try {
      runner = yamlToRunnerData(yamlContent)
    } catch (error) {
      onError?.(error)
      return
    }

    await onParsed(runner)
  }

  const inputProps = {
    ref: inputRef,
    type: "file",
    accept: ".yaml,.yml",
    style: { display: "none" },
    onChange: (event: ChangeEvent<HTMLInputElement>) => { void handleFileChange(event) },
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  return { inputRef, inputProps, openFilePicker }
}
