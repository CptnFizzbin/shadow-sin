import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const ActiveMatrixNodeSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const matrixNode = useRunnerStoreSelector(Selectors.matrix.selectMatrixNode)

  return (
    <Stack sx={{ gap: 1 }}>
      <Label label="Active Matrix Node" />

      <TextField
        label="Node Name"
        size="small"
        fullWidth
        value={matrixNode.name}
        onChange={(e) => dispatch(Actions.matrix.setMatrixNodeName(e.target.value))}
      />

      <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
        <CounterInput
          label="System"
          size="small"
          min={0}
          max={99}
          value={matrixNode.system}
          onChange={(newValue) => dispatch(Actions.matrix.setMatrixNodeSystem(newValue ?? 0))}
        />

        <CounterInput
          label="Firewall"
          size="small"
          min={0}
          max={99}
          value={matrixNode.firewall}
          onChange={(newValue) => dispatch(Actions.matrix.setMatrixNodeFirewall(newValue ?? 0))}
        />

        <CounterInput
          label="Response"
          size="small"
          min={0}
          max={99}
          value={matrixNode.response}
          onChange={(newValue) => dispatch(Actions.matrix.setMatrixNodeResponse(newValue ?? 0))}
        />

        <CounterInput
          label="Signal"
          size="small"
          min={0}
          max={99}
          value={matrixNode.signal}
          onChange={(newValue) => dispatch(Actions.matrix.setMatrixNodeSignal(newValue ?? 0))}
        />

        <CounterInput
          label="Programs"
          size="small"
          min={0}
          value={matrixNode.numberOfPrograms}
          onChange={(newValue) => dispatch(Actions.matrix.setMatrixNodeNumberOfPrograms(newValue ?? 0))}
        />
      </Stack>
    </Stack>
  )
}
