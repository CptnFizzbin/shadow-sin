import Button from "@mui/material/Button"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useRunnerManager } from "#/contexts/runner/runnerManagerContext.tsx"
import { useRunnerStoreContext } from "#/contexts/runner/runnerStore.context.ts"
import { useAllAlerts } from "#/hooks/builder/alerts/useAllAlerts.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

interface SaveRunnerButtonProps {
  // Character creation enforces build-point validity; editing an existing runner should not
  // be blocked by build-point budget errors that only make sense at creation time.
  requireValid?: boolean
}

export const SaveRunnerButton: FC<SaveRunnerButtonProps> = ({ requireValid = true }) => {
  const store = useRunnerStoreContext()
  const navigate = useNavigate()
  const runnerManager = useRunnerManager()

  const saveRunner = useMutation({
    mutationFn: async () => {
      let runner = store.getState()

      if (runner.id === NullUuid) {
        runner = { ...runner, id: crypto.randomUUID() }
      }

      await runnerManager.saveRunner(runner)
      await navigate({ to: "/$runnerId", params: { runnerId: runner.id } })
    },
  })

  const hasErrors = useAllAlerts().some((status) => status.severity === "error")
  const isValid = !requireValid || !hasErrors

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!isValid || saveRunner.isPending}
      onClick={() => saveRunner.mutate()}
    >
      Save
    </Button>
  )
}
