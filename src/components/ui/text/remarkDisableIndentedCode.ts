// Loads remark-parse's augmentation of unified's `Data`, which declares `micromarkExtensions`.
import type {} from "remark-parse"
import type { Processor } from "unified"

/**
 * Remark plugin that turns off indented code blocks, so free text pasted with leading indentation renders as prose.
 * Fenced code blocks are unaffected.
 */
export function remarkDisableIndentedCode(this: Processor): void {
  const data = this.data()
  data.micromarkExtensions ??= []
  data.micromarkExtensions.push({ disable: { null: ["codeIndented"] } })
}
