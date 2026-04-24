import type { ConfirmDialogProps } from "#/components/ui/dialogs/confirmDialog.tsx"
import { ConfirmDialog } from "#/components/ui/dialogs/confirmDialog.tsx"
import { useRootDialogs } from "#/components/ui/dialogs/rootDialogOutlet.tsx"

interface UseConfirmDialogProps {
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
