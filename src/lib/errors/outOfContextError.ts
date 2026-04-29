/**
 * Thrown when a hook or component tries to consume a React context that is not
 * present in the current render tree. This commonly surfaces when a dialog is
 * opened via `DialogApi` whose outlet sits *outside* one of the required
 * context providers.
 *
 * @example
 * ```ts
 * throw new OutOfContextError("useCharacterSheetContext", "CharacterSheetProvider")
 * ```
 */
export class OutOfContextError extends Error {
  /** The name of the hook or accessor that required the context. */
  public readonly contextName: string
  /** The name of the provider component that must wrap the consumer. */
  public readonly requiredProvider: string

  constructor(contextName: string, requiredProvider: string) {
    super(`${contextName} must be used within ${requiredProvider}`)
    this.name = "OutOfContextError"
    this.contextName = contextName
    this.requiredProvider = requiredProvider
  }
}
