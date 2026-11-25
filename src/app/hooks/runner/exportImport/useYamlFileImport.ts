import type { ChangeEvent, InputHTMLAttributes, RefObject } from "react"
import { useRef } from "react"

import type { ImportedFile } from "#/components/system/exportImport/dataPacketUtils.ts"
import { DataPacketExtension, parseImportedYaml } from "#/components/system/exportImport/dataPacketUtils.ts"
import type { DataPacketData } from "#/system/model/dataPacket/dataPacketData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

interface UseYamlFileImportOptions {
  /** Called with the parsed runner sheet after a successful YAML parse. */
  onParsed: (runner: RunnerData) => void | Promise<void>
  /**
   * Called with the parsed Data Packet when the file is one. When omitted, picking a Data Packet
   * reports an error through `onError` instead.
   */
  onDataPacket?: (packet: DataPacketData) => void | Promise<void>
  /** Called when YAML parsing throws, or the file is a Data Packet this caller can't accept. */
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

type ParseResult =
  | { ok: true, file: ImportedFile }
  | { ok: false, error: unknown }

/**
 * Parses YAML content into a Runner or Data Packet, capturing any thrown error instead
 * of letting it propagate.
 */
// Kept as a plain function outside `useYamlFileImport` rather than inlined in its closure —
// the React Compiler transform mishandles a try/catch nested directly inside a hook's returned closures.
function parseYamlContent(yamlContent: string): ParseResult {
  try {
    return { ok: true, file: parseImportedYaml(yamlContent) }
  } catch (error) {
    return { ok: false, error }
  }
}

/**
 * Shared file input handling for YAML runner imports.
 *
 * Encapsulates the hidden-input + ref + read-and-reset behaviour used by the
 * various "Import" buttons across the app. Callers provide success /
 * error handlers, spread `inputProps` onto a hidden file input, and call
 * `openFilePicker` from their own trigger button.
 */
export function useYamlFileImport({
  onParsed,
  onDataPacket,
  onError,
}: UseYamlFileImportOptions): UseYamlFileImportResult {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected if needed
    event.target.value = ""

    const yamlContent = await file.text()
    const result = parseYamlContent(yamlContent)

    if (!result.ok) {
      onError?.(result.error)
      return
    }

    const { file: importedFile } = result
    if (importedFile.kind === "runner") {
      await onParsed(importedFile.runner)
    } else if (onDataPacket) {
      await onDataPacket(importedFile.packet)
    } else {
      onError?.(new Error("Data packets can only be imported into an existing runner — open the runner and import it from there."))
    }
  }

  const inputProps = {
    ref: inputRef,
    type: "file",
    accept: `.sin,.${DataPacketExtension},.yaml,.yml`,
    style: { display: "none" },
    onChange: (event: ChangeEvent<HTMLInputElement>) => { void handleFileChange(event) },
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  return { inputRef, inputProps, openFilePicker }
}
