import type { FC } from "react"

import { ItemDialog } from "#/components/entities/items/dialogs/itemDialog.tsx"
import { AgentFormFields } from "#/components/entities/items/types/devices/forms/agentFormFields.tsx"
import { GearFormLicenseSection } from "#/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { agentFieldMap, useAgentForm } from "#/hooks/items/types/devices/forms/useAgentForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AnyDialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

interface AgentFormDialogProps {
  ctrl: AnyDialogCtrl
  agent?: AgentData
  parentId?: UUID
}

export const AgentFormDialog: FC<AgentFormDialogProps> = ({ ctrl, agent, parentId }) => {
  const title = agent ? "Edit Agent" : "Add Agent"

  const form = useAgentForm({
    agent,
    parentId,
    onSubmit: (submittedAgent) => ctrl.close(submittedAgent),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      onClosed={() => form.reset()}
      parentItemFilter={(item) => item.itemType === ItemType.device}
      parentItemLabel="Device"
      options={{
        hasRating: { forced: true },
        isSubItem: { forced: true },
      }}
      slots={{
        itemFields: () => (
          <>
            <AgentFormFields form={form} fields={agentFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseAgentFormDialogProps = Omit<AgentFormDialogProps, "ctrl">

export const useAgentFormDialog = () => useDialog<AgentData, UseAgentFormDialogProps | undefined>(
  (ctrl, props) => <AgentFormDialog ctrl={ctrl} {...props} />,
)
