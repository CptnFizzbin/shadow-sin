import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { TestTrackerActions } from "#/state/runner/extendedTests/extendedTests.actions.ts"
import { ExtendedTestsSelectors } from "#/state/runner/extendedTests/extendedTests.selector.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ExtendedTestEntry } from "#/system/model/checks/extendedTestData.ts"

import { ExtendedTestCard } from "./extendedTestCard.tsx"
import { useAddExtendedTestDialog, useEditExtendedTestDialog } from "./extendedTestDialog.tsx"

export const ExtendedTestsSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const tests = useRunnerSelector(ExtendedTestsSelectors.selectAll)
  const addDialog = useAddExtendedTestDialog()
  const editDialog = useEditExtendedTestDialog()
  const confirmDialog = useConfirmDialog()

  const handleRemove = async (test: ExtendedTestEntry) => {
    if (await confirmDialog.confirm({
      title: `Remove "${test.description}"?`,
      body: "Are you sure you want to remove this Extended Test? This action cannot be undone.",
      confirmLabel: "Remove",
    })) {
      dispatch(TestTrackerActions.remove(test.id))
    }
  }

  return (
    <Stack>
      <Label label="Extended Tests" />

      {tests.length === 0 && (
        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
          No long-term Extended Tests tracked
        </Typography>
      )}

      {tests.map((test) => (
        <ExtendedTestCard
          key={test.id}
          test={test}
          onEdit={() => editDialog.open({ test })}
          onRemove={() => handleRemove(test)}
          onHitsChange={(hits) => dispatch(TestTrackerActions.setHits({ id: test.id, hits }))}
          onAttemptsChange={(attempts) => dispatch(TestTrackerActions.setAttemps({ id: test.id, attempts }))}
        />
      ))}

      <Button
        size="small"
        variant="outlined"
        startIcon={<RiAddLine size={14} />}
        onClick={() => addDialog.open()}
      >
        Add Extended Test
      </Button>

      {addDialog.outlet}
      {editDialog.outlet}
      {confirmDialog.outlet}
    </Stack>
  )
}
