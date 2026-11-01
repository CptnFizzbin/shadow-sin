import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useId, useState } from "react"

import { MatrixNodeFields } from "#/components/system/matrix/form/matrixNodeFields.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useKnownNodeForm } from "#/hooks/runner/matrix/form/useKnownNodeForm.ts"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { MatrixSelectors } from "#/state/runner/gameState/matrix/matrix.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import { AccessLevel, AccessLevelLabels } from "#/system/model/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/model/matrix/knownNode.ts"
import { KnownNodeSchema } from "#/system/model/matrix/knownNode.ts"

const NEW_NODE = "new"

/** Access Levels below User, on which a Program can't run (advisory only — see `docs/features/0014-matrix-interactions.md`). */
const INSUFFICIENT_ACCESS_LEVELS: ReadonlySet<AccessLevel> = new Set([AccessLevel.none, AccessLevel.public])

const describeNode = (node: KnownNode) => [
  `Sys ${node.matrix.system ?? 0}`,
  `FWL ${node.matrix.firewall ?? 0}`,
  `Rsp ${node.matrix.response ?? 0}`,
  `Sig ${node.matrix.signal ?? 0}`,
  AccessLevelLabels[node.accessLevel],
].join(" · ")

interface RunProgramDialogProps extends ControlledDialogProps<void> {
  program: ProgramData
}

const RunProgramDialog: FC<RunProgramDialogProps> = ({ ctrl, program }) => {
  const dispatch = useRunnerStoreDispatch()
  const formId = useId()
  const knownNodes = useRunnerSelector(MatrixSelectors.selectKnownNodes)
  const activePrograms = useRunnerSelector(MatrixSelectors.selectActivePrograms)

  const runningNodeIds = new Set(
    activePrograms.filter((activeProgram) => activeProgram.sourceId === program.id).map(({ nodeId }) => nodeId),
  )
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    () => knownNodes.find((node) => !runningNodeIds.has(node.id))?.id ?? NEW_NODE,
  )
  const selectedNode = knownNodes.find((node) => node.id === selectedNodeId)

  const runOn = (nodeId: string) => {
    dispatch(Actions.gameState.matrix.startActiveProgram({ sourceId: program.id, nodeId }))
    ctrl.close()
  }

  const form = useKnownNodeForm({
    onSubmit: (rawNode) => {
      const addNodeAction = Actions.gameState.matrix.addKnownNode(KnownNodeSchema.parse(rawNode))
      dispatch(addNodeAction)
      runOn(addNodeAction.payload.id)
    },
  })

  const handleSubmit = () => {
    if (selectedNodeId === NEW_NODE) form.handleSubmit()
    else runOn(selectedNodeId)
  }

  return (
    <ControlledDialog ctrl={ctrl} onClose={false}>
      <Dialog.Title>{`Run ${program.name}`}</Dialog.Title>
      <Dialog.Content>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Stack sx={{ padding: 1 }}>
            <Label>Node</Label>
            <RadioGroup
              aria-label="Node"
              value={selectedNodeId}
              onChange={(_, value) => setSelectedNodeId(value)}
            >
              {knownNodes.map((node) => {
                const isRunning = runningNodeIds.has(node.id)

                return (
                  <FormControlLabel
                    key={node.id}
                    value={node.id}
                    disabled={isRunning}
                    control={<Radio />}
                    label={(
                      <Stack sx={{ gap: 0 }}>
                        <Typography>{isRunning ? `${node.name} (running)` : node.name}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {describeNode(node)}
                        </Typography>
                      </Stack>
                    )}
                  />
                )
              })}

              <FormControlLabel value={NEW_NODE} control={<Radio />} label="New Node" />
            </RadioGroup>

            {selectedNode && INSUFFICIENT_ACCESS_LEVELS.has(selectedNode.accessLevel) && (
              <Alert severity="warning">
                Running a Program on a Known Node needs at least User access.
              </Alert>
            )}

            {selectedNodeId === NEW_NODE && <MatrixNodeFields form={form} />}
          </Stack>
        </form>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="secondary" onClick={() => ctrl.close()}>
          Cancel
        </Button>

        <Button type="submit" color="secondary" variant="contained" form={formId}>
          Run
        </Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseRunProgramDialogProps {
  program: ProgramData
}

/** Opens a dialog to start `program` Running on a chosen Known Node, or on a new one added from the dialog. */
export const useRunProgramDialog = () => useDialog<void, UseRunProgramDialogProps>(
  (ctrl, props) => <RunProgramDialog ctrl={ctrl} {...props} />,
)
