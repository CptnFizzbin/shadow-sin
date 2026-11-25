import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useId } from "react"

import { MatrixNodeFields } from "#app/components/system/matrix/form/matrixNodeFields.tsx"
import { NullUuid } from "#common/uuid/uuidUtils.ts"
import type { KnownNode } from "#data/matrix/knownNode.ts"
import { KnownNodeSchema } from "#data/matrix/knownNode.ts"
import { useKnownNodeForm } from "#forms/matrix/useKnownNodeForm.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import type { ControlledDialogProps } from "#ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#ui/dialog/dialog.tsx"
import { useDialog } from "#ui/dialog/useDialog.tsx"

interface KnownNodeFormDialogProps extends ControlledDialogProps<void> {
  node?: KnownNode
}

const KnownNodeFormDialog: FC<KnownNodeFormDialogProps> = ({ ctrl, node }) => {
  const isEditMode = !!node
  const title = isEditMode ? "Edit Known Node" : "Add Known Node"
  const dispatch = useRunnerStoreDispatch()
  const formId = useId()

  const handleSubmit = (rawNode: KnownNode) => {
    const savedNode = KnownNodeSchema.parse(rawNode)
    if (!savedNode.id || savedNode.id === NullUuid) {
      dispatch(Actions.gameState.matrix.addKnownNode(savedNode))
    } else {
      dispatch(Actions.gameState.matrix.updateKnownNode(savedNode))
    }
    ctrl.close()
  }

  const form = useKnownNodeForm({
    node,
    onSubmit: handleSubmit,
  })

  const handleClosed = () => {
    form.reset()
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false} onClosed={handleClosed}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <Stack sx={{ padding: 1 }}>
            <MatrixNodeFields form={form} />
          </Stack>
        </form>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          color="secondary"
          onClick={() => ctrl.close()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          form={formId}
        >
          Save
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseKnownNodeFormDialogProps {
  node?: KnownNode
}

export const useKnownNodeFormDialog = () => useDialog<void, UseKnownNodeFormDialogProps | undefined>(
  (ctrl, props) => <KnownNodeFormDialog ctrl={ctrl} {...props} />,
)
