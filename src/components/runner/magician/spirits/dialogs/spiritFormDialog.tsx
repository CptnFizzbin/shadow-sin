import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SpiritFormFields } from "#/components/runner/magician/spirits/form/spiritFormFields.tsx"
import { SummoningSection } from "#/components/runner/magician/spirits/summoningSection.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useSpiritForm } from "#/lib/hooks/runner/magician/spirits/form/useSpiritForm.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { selectTradition } from "#/lib/stores/runner/tradition/traditionSlice.selectors.ts"
import type { SpiritData, SpiritType } from "#/system/magic/spiritData.ts"

interface SpiritFormDialogProps {
  open: boolean
  spirit?: SpiritData
  onClose: (result?: SpiritData) => void
  onClosed?: () => void
}

export const SpiritFormDialog: FC<SpiritFormDialogProps> = ({
  open,
  onClose,
  onClosed,
  spirit,
}) => {
  const tradition = useRunnerStoreSelector(selectTradition)

  const form = useSpiritForm({
    spirit,
    onSubmit: (values) => onClose(values),
  })

  return (
    <Dialog
      open={open}
      onClosed={onClosed}
      maxWidth="sm"
    >
      <Dialog.Title>{spirit ? "Edit Spirit" : "Summon Spirit"}</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <SpiritFormFields form={form} tradition={tradition} />
          <Divider />
          <form.Subscribe selector={(state): [SpiritType, number, boolean] => [state.values.spiritType, state.values.force, state.values.bound]}>
            {([spiritType, force, bound]) => <SummoningSection spiritType={spiritType} force={force} isBound={bound} />}
          </form.Subscribe>
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={() => onClose()}>Cancel</Button>
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
    </Dialog>
  )
}
