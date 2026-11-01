import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { z } from "zod"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { TestTrackerActions } from "#/state/runner/extendedTests/extendedTests.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { AvailabilityFormulas } from "#/system/formulas/checks/availabilityFormulas.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
import { DurationUtils } from "#/utils/duration/durationUtils.ts"

type AvailabilityTestDialogProps = ControlledDialogProps<void>

/**
 * Sets up an Availability Test for acquiring an item: an Extended Negotiation + Charisma Test with
 * the item's Availability as the Threshold and an interval set by its cost. Submitting adds the test
 * to the Runner's tracked Extended Tests.
 */
const AvailabilityTestDialog: FC<AvailabilityTestDialogProps> = ({ ctrl }) => {
  const dispatch = useRunnerStoreDispatch()

  const dicePool = createDicePool("availabilityTest", "Availability Test", [
    useActiveSkillDiceGroup(SkillKey.negotiation),
    useAttrDiceGroup(AttributeKey.charisma),
  ])

  const form = useAppForm({
    defaultValues: { itemName: "", availability: 1, cost: 0 as number | undefined },
    onSubmit: ({ value }) => {
      dispatch(TestTrackerActions.add({
        description: `Availability: ${value.itemName.trim()}`,
        interval: AvailabilityFormulas.getTestInterval(value.cost ?? 0),
        hitsThreshold: value.availability,
        currentHits: 0,
        attempts: 0,
      }))
      ctrl.close()
    },
  })

  const availability = useSelector(form.store, (state) => state.values.availability)
  const cost = useSelector(form.store, (state) => state.values.cost)

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="xs" onClose={false}>
      <Dialog.Title>Availability Test</Dialog.Title>

      <Dialog.Content>
        <form.AppForm>
          <Stack sx={{ gap: 2, pt: 1 }}>
            <form.AppField
              name="itemName"
              validators={{
                onChange: z.string().trim().min(1, "Item is required"),
                onSubmit: z.string().trim().min(1, "Item is required"),
              }}
            >
              {(field) => (
                <field.TextField label="Item" placeholder="e.g., Ares Predator IV" />
              )}
            </form.AppField>

            <Stack direction="row" sx={{ alignItems: "flex-start" }}>
              <form.AppField
                name="availability"
                validators={{
                  onChange: z.number("Availability is required").int().min(1, "Availability must be at least 1"),
                }}
              >
                {(field) => (
                  <field.CounterField label="Availability" min={1} fullWidth />
                )}
              </form.AppField>

              <form.AppField
                name="cost"
                validators={{
                  onChange: z.number("Cost is required").min(0, "Cost must be 0 or more"),
                }}
              >
                {(field) => (
                  <field.NuyenField label="Cost" fullWidth />
                )}
              </form.AppField>
            </Stack>

            <DicePool name={dicePool.name} groups={dicePool.groups} />

            <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
              <Chip label={`Threshold: ${availability}`} size="small" variant="outlined" />
              <Chip
                label={`Interval: ${DurationUtils.format(AvailabilityFormulas.getTestInterval(cost ?? 0))}`}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              The test is tracked with the Runner's other Extended Tests on the Notes page.
            </Typography>
          </Stack>
        </form.AppForm>
      </Dialog.Content>

      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => form.handleSubmit()}
        >
          Track Test
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useAvailabilityTestDialog = () => useDialog<void>(
  (ctrl) => <AvailabilityTestDialog ctrl={ctrl} />,
)
