import { useAttributesContext } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { EntityWithAttrs } from "#/system/entities/entityTraits.ts"

export interface ProvidedEntity extends EntityWithAttrs {

}

export const useEntity = (): ProvidedEntity => {
  const attrs = useAttributesContext()

  return {
    attributes: attrs.values,
  }
}
