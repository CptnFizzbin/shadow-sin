import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { AccessLevel } from "#/system/model/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/model/matrix/knownNode.ts"
import { NodeType } from "#/system/model/matrix/nodeType.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

const defaultValues: KnownNode = {
  kind: EntityKind.matrixNode,
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
