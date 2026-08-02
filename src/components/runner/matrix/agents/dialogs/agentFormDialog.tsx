import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AgentFormFields } from "#/components/runner/matrix/agents/form/agentFormFields.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useAgentForm } from "#/lib/hooks/runner/matrix/agents/form/useAgentForm.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { AgentData } from "#/system/matrix/agentData.ts"

interface AgentFormDialogProps extends ControlledDialogProps<AgentData> {
  agent?: AgentData
}

const AgentFormDialog: FC<AgentFormDialogProps> = ({ ctrl, agent }) => {
  const form = useAgentForm({
    agent,
    onSubmit: (values) => ctrl.close(values),
  })

  return (
    <ControlledDialog ctrl={ctrl} onClose={false} maxWidth="sm">
      <Dialog.Title>{agent ? "Edit Agent" : "Add Agent"}</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <AgentFormFields form={form} />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Cancel</Button>
        <form.Subscribe selector={(state): [boolean, boolean] => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              onClick={() => form.handleSubmit()}
              variant="contained"
            >
              Save
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseAgentFormDialogProps = Omit<AgentFormDialogProps, keyof ControlledDialogProps<AgentData>>

export const useAgentFormDialog = () => useDialog<AgentData, UseAgentFormDialogProps | undefined>(
  (ctrl, props) => <AgentFormDialog ctrl={ctrl} {...props} />,
)
