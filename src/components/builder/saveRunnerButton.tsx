import Button from "@mui/material/Button"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { useRunnerManager } from "#/runner/runnerManagerContext.tsx"

import { useAllAlerts } from "./alerts/hooks/useAllAlerts.ts"

export const SaveRunnerButton: FC = () => {
  const store = useRunnerDataContext()
  const navigate = useNavigate()
  const runnerManager = useRunnerManager()

  const saveRunner = useMutation({
    mutationFn: async () => {
      let runner = store.get()

      if (runner.id === NullUuid) {
        runner = { ...runner, id: crypto.randomUUID() }
      }

      await runnerManager.saveRunner(runner)
      await navigate({ to: "/$runnerId", params: { runnerId: runner.id } })
    },
  })

  const isValid = useAllAlerts()
    .filter((status) => status.severity === "error")
    .length === 0

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
