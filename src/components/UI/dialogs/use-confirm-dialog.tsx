import type { ConfirmDialogProps } from "#/components/UI/dialogs/confirm-dialog.tsx"
import { ConfirmDialog } from "#/components/UI/dialogs/confirm-dialog.tsx"
import { useRootDialogs } from "#/components/UI/dialogs/root-dialog-outlet.tsx"

export interface UseConfirmDialogProps {
  id: string
}

export const useConfirmDialog = ({ id }: UseConfirmDialogProps) => {
  const rootDialogs = useRootDialogs()

  return {
    confirm: (props: Omit<ConfirmDialogProps, "onCancel" | "onConfirm" | "onClosed">): Promise<boolean> => {
      return new Promise((resolve) => {
        const dialog = (
          <ConfirmDialog
            {...props}
            onCancel={() => resolve(false)}
            onConfirm={() => resolve(true)}
            onClosed={() => rootDialogs.remove(id)}
          />
        )

        rootDialogs.add(id, dialog)
      })
    },
  }
}
