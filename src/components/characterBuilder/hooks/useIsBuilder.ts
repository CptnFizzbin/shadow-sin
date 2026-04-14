import { useContext } from "react"

import { CharacterBuilderContext } from "#/components/characterBuilder/characterBuilderStoreProvider.tsx"

/**
 * Returns true if the current component tree is rendered inside the character builder,
 * false if rendered in the character viewer or any other context.
 *
 * Use this hook in form dialogs to decide whether to show a Save button (builder)
 * or Acquire / Purchase buttons (viewer).
 */
export const useIsBuilder = (): boolean => {
  const context = useContext(CharacterBuilderContext)
  return context !== null
}
