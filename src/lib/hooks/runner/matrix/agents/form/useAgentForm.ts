import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { AgentData } from "#/system/matrix/agentData.ts"

const defaultValues: AgentData = {
  id: NullUuid,
  name: "",
  rating: 1,
  notes: "",
}

interface AgentFormOptions {
  agent?: AgentData
  onSubmit: (values: AgentData) => void
}

export function useAgentForm(props: AgentFormOptions) {
  const isNew = !props.agent

  return useAppForm({
    defaultValues: {
      ...defaultValues,
      ...props.agent,
      id: isNew || props.agent?.id === NullUuid ? crypto.randomUUID() : props.agent!.id,
    },
    onSubmit: ({ value }) => props.onSubmit(value),
  })
}

export type AgentForm = ReturnType<typeof useAgentForm>
