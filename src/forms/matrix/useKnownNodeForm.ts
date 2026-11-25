import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import { AccessLevel } from "#/data/matrix/accessLevel.ts"
import type { KnownNode } from "#/data/matrix/knownNode.ts"
import { NodeType } from "#/data/matrix/nodeType.ts"
import { useAppForm } from "#/forms/tanstackForm/useAppForm.ts"

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
