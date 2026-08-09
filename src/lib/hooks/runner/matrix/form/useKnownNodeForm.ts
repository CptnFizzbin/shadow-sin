import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { AccessLevel } from "#/system/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import { NodeType } from "#/system/matrix/nodeType.ts"

const defaultValues: KnownNode = {
  id: NullUuid,
  name: "",
  matrix: {
    system: 0,
    firewall: 0,
    response: 0,
    signal: 0,
  },
  nodeType: NodeType.general,
  accessLevel: AccessLevel.public,
}

interface KnownNodeFormOptions {
  node?: KnownNode
  onSubmit: (node: KnownNode) => void
}

export const useKnownNodeForm = (options: KnownNodeFormOptions) => {
  return useAppForm({
    defaultValues: {
      ...defaultValues,
      ...options.node,
      matrix: { ...defaultValues.matrix, ...options.node?.matrix },
    },
    onSubmit: ({ value }) => options.onSubmit(value),
  })
}

export type KnownNodeForm = ReturnType<typeof useKnownNodeForm>
