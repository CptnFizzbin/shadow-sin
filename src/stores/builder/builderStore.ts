import type { BuilderState } from "#/components/builder/builderState.ts"
import type { CompatStore } from "#/integrations/reduxToolkit/compatStore.ts"

export type BuilderStore = CompatStore<BuilderState>
