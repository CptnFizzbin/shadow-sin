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
        const localDialogId = `${id}-${crypto.randomUUID()}`
        let isSettled = false

        const settle = (value: boolean) => {
          if (isSettled) {
            return
          }

          isSettled = true
          resolve(value)
        }

        const dialog = (
          <ConfirmDialog
            {...props}
            onCancel={() => settle(false)}
            onConfirm={() => settle(true)}
            onClosed={() => {
              settle(false)
              rootDialogs.remove(localDialogId)
            }}
          />
        )

        rootDialogs.add(localDialogId, dialog)
      })
    },
  }
}
