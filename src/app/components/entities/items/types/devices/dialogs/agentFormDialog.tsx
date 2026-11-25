import type { FC } from "react"

import { ItemDialog } from "#app/components/entities/items/dialogs/itemDialog.tsx"
import { AgentFormFields } from "#app/components/entities/items/types/devices/forms/agentFormFields.tsx"
import { GearFormLicenseSection } from "#app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import type { AgentData } from "#data/items/agentData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { agentFieldMap, useAgentForm } from "#forms/items/types/devices/useAgentForm.tsx"
import type { AnyDialogCtrl } from "#ui/dialog/dialogCtrl.ts"
import { useDialog } from "#ui/dialog/useDialog.tsx"

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
