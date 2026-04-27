import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import pluralize from "pluralize"
import type { FC } from "react"

import { selectEdgeCurrent, selectEdgeMax } from "#/components/character/quickPanel/edgeSelectors.ts"
import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import type { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import {
  ExtendedInterval,
  ExtendedIntervalLabels,
  TestType,
  TestTypeLabels,
} from "#/components/dice/testType.ts"
import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { CounterField } from "#/components/ui/counter/counterField.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import {
  selectAllDice,
  selectHits,
  selectIsRolling,
  selectRollState,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"
import { RollState } from "#/system/dice/rollState.ts"

interface DiceTrayDialogProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayDialog: FC<DiceTrayDialogProps> = ({ diceTrayApi }) => {
  const open = useSelector(diceTrayApi.store, (state) => state.open)
  const edgeSpent = useSelector(diceTrayApi.store, (state) => state.edgeSpent)
  const threshold = useSelector(diceTrayApi.store, (state) => state.threshold)
  const poolSize = useSelector(diceTrayApi.store, (state) => state.poolSize)
  const testType = useSelector(diceTrayApi.store, (state) => state.testType)
  const opposedHits = useSelector(diceTrayApi.store, (state) => state.opposedHits)
  const extendedInterval = useSelector(diceTrayApi.store, (state) => state.extendedInterval)
  const shrinkingPool = useSelector(diceTrayApi.store, (state) => state.shrinkingPool)
  const extendedHistory = useSelector(diceTrayApi.store, (state) => state.extendedHistory)
  const physicalMode = useSelector(diceTrayApi.store, (state) => state.physicalMode)
  const physicalHits = useSelector(diceTrayApi.store, (state) => state.physicalHits)

  const allDice = useDiceRollerSelector(diceTrayApi.roller, selectAllDice)
  const isRolling = useDiceRollerSelector(diceTrayApi.roller, selectIsRolling)
  const wasRolled = useDiceRollerSelector(diceTrayApi.roller, selectWasRolled)
  const hits = useDiceRollerSelector(diceTrayApi.roller, selectHits)
  const rollState = useDiceRollerSelector(diceTrayApi.roller, selectRollState)

  const edgeStore = useEdgeStore()
  const maxEdge = useSelector(edgeStore, selectEdgeMax)
  const currentEdge = useSelector(edgeStore, selectEdgeCurrent)

  const edgeDiceCount = Math.max(0, allDice.length - poolSize)
  const hasEdgeDice = edgeDiceCount > 0

  const currentHits = physicalMode ? physicalHits : hits
  const previousExtendedHits = extendedHistory.reduce((sum, entry) => sum + entry.hits, 0)
  const totalExtendedHits = previousExtendedHits + (wasRolled || physicalMode ? currentHits : 0)
  const netHits = Math.max(0, currentHits - opposedHits)

  const handleRoll = () => {
    if (physicalMode) return
    diceTrayApi.reset()
    diceTrayApi.rollStandard()
  }

  const handleReset = () => {
    if (physicalMode) {
      diceTrayApi.setPhysicalHits(0)
      return
    }
    diceTrayApi.reset()
  }

  const handleRerollMisses = () => {
    if (diceTrayApi.store.state.edgeSpent) return
    diceTrayApi.rerollMisses()
    edgeStore.setCurrent(currentEdge - 1)
  }

  const handleEdge = () => {
    if (diceTrayApi.store.state.edgeSpent) return
    diceTrayApi.rollEdge(maxEdge)
    edgeStore.setCurrent(currentEdge - 1)
  }

  const handleNextExtendedRoll = () => {
    diceTrayApi.recordExtendedRoll(currentHits)
    if (physicalMode) {
      diceTrayApi.setPhysicalHits(0)
    }
  }

  const isExtendedTest = testType === TestType.Extended
  const isOpposedTest = testType === TestType.Opposed
  const isStandardTest = testType === TestType.Standard

  return (
    <Dialog
      open={open}
      onClose={() => diceTrayApi.close()}
      slotProps={{
        transition: {
          onExited: () => diceTrayApi.reset(),
        },
      }}
      fullWidth
    >
      <DialogTitle>Dice Tray</DialogTitle>

      <DialogContent>
        <Stack sx={{ paddingTop: 1 }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="dice-tray-test-type-label">Test Type</InputLabel>
              <Select
                labelId="dice-tray-test-type-label"
                label="Test Type"
                value={testType}
                onChange={(event) => diceTrayApi.setTestType(event.target.value as TestType)}
              >
                {Object.values(TestType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {TestTypeLabels[type]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={(
                <Switch
                  checked={physicalMode}
                  onChange={(event) => diceTrayApi.setPhysicalMode(event.target.checked)}
                />
              )}
              label={physicalMode ? "Physical Dice" : "Digital Dice"}
            />
          </Stack>

          <Stack direction="row">
            <CounterField
              value={poolSize}
              onChange={(newValue) => diceTrayApi.setPoolSize(newValue ?? 1)}
              min={1}
              max={32}
              disabled={isRolling}
              label="Dice"
              fullWidth
            />

            {isStandardTest && (
              <CounterField
                value={threshold}
                onChange={(newValue) => diceTrayApi.setThreshold(newValue ?? 1)}
                min={1}
                max={32}
                disabled={isRolling}
                label="Threshold"
                fullWidth
              />
            )}

            {isOpposedTest && (
              <CounterField
                value={opposedHits}
                onChange={(newValue) => diceTrayApi.setOpposedHits(newValue ?? 0)}
                min={0}
                max={32}
                disabled={isRolling}
                label="Opposed Hits"
                fullWidth
              />
            )}

            {isExtendedTest && (
              <CounterField
                value={threshold}
                onChange={(newValue) => diceTrayApi.setThreshold(newValue ?? 1)}
                min={1}
                max={99}
                disabled={isRolling}
                label="Threshold"
                fullWidth
              />
            )}
          </Stack>

          {isExtendedTest && (
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="dice-tray-extended-interval-label">Interval</InputLabel>
                <Select
                  labelId="dice-tray-extended-interval-label"
                  label="Interval"
                  value={extendedInterval}
                  onChange={(event) =>
                    diceTrayApi.setExtendedInterval(event.target.value as ExtendedInterval)}
                >
                  {Object.values(ExtendedInterval).map((interval) => (
                    <MenuItem key={interval} value={interval}>
                      {ExtendedIntervalLabels[interval]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={(
                  <Switch
                    checked={shrinkingPool}
                    onChange={(event) => diceTrayApi.setShrinkingPool(event.target.checked)}
                  />
                )}
                label="Shrinking Pool"
              />
            </Stack>
          )}

          {!physicalMode && (
            <Stack sx={{ gap: 1 }}>
              <Box>
                <Label label="Pool Dice" variant="text" />
                <DiceResult
                  roller={diceTrayApi.roller}
                  iconSize={48}
                  startIndex={0}
                  endIndex={poolSize}
                />
              </Box>

              {hasEdgeDice && (
                <Box>
                  <Label label={`Edge Dice (${edgeDiceCount})`} color="warning.main" variant="text" />
                  <DiceResult
                    roller={diceTrayApi.roller}
                    iconSize={48}
                    startIndex={poolSize}
                  />
                </Box>
              )}
            </Stack>
          )}

          {physicalMode && (
            <Stack sx={{ alignItems: "center", paddingY: 2 }}>
              <CounterField
                value={physicalHits}
                onChange={(newValue) => diceTrayApi.setPhysicalHits(newValue ?? 0)}
                min={0}
                max={99}
                label="Hits"
              />
            </Stack>
          )}

          <Stack sx={{ gap: 0 }}>
            {!physicalMode && rollState === RollState.Assembling && (
              <Label label="Assembling dice" variant="text" />
            )}

            {!physicalMode && rollState === RollState.Rolling && (
              <Label label="Rolling..." color="secondary.dark" variant="text" />
            )}

            {!physicalMode && rollState === RollState.Critical && (
              <Label label="CRITICAL GLITCH!" color="error.main" variant="contained" />
            )}

            {!physicalMode && rollState === RollState.Glitch && (
              <Label label="Glitch!" color="error.main" variant="text" />
            )}

            {!physicalMode && isStandardTest && rollState === RollState.Hit && (
              <Label label={hits >= threshold ? "Success!" : "Miss"} variant="text" />
            )}

            {!physicalMode && isStandardTest && rollState === RollState.Miss && (
              <Label label="Miss" variant="text" />
            )}

            {isOpposedTest && (wasRolled || physicalMode) && (
              <Label
                label={`Net hits: ${netHits}`}
                color={netHits > 0 ? "success.main" : "secondary.dark"}
                variant="text"
              />
            )}

            {isExtendedTest && (
              <Label
                label={`Total hits: ${totalExtendedHits} / ${threshold}`
                  + (extendedHistory.length > 0 ? ` (after ${extendedHistory.length} ${pluralize("roll", extendedHistory.length)})` : "")}
                color={totalExtendedHits >= threshold ? "success.main" : "secondary.dark"}
                variant="text"
              />
            )}

            {wasRolled || physicalMode
              ? (
                  <Label
                    label={`${currentHits} ${pluralize("hit", currentHits)}`}
                    color="secondary.dark"
                    variant="contained"
                  />
                )
              : (
                  <Label label="-" color="secondary.dark" variant="contained" />
                )}
          </Stack>

          {isExtendedTest && extendedHistory.length > 0 && (
            <Stack sx={{ gap: 0.5 }}>
              <Label label="Roll History" variant="text" />
              {extendedHistory.map((entry, index) => (
                <Typography key={index} variant="caption" sx={{ textAlign: "center" }}>
                  Roll {index + 1}: {entry.hits} {pluralize("hit", entry.hits)}
                  {entry.edgeUsed ? " (edge)" : ""}
                </Typography>
              ))}
            </Stack>
          )}

          {!physicalMode && (
            <Stack sx={{ gap: 1 }}>
              <Label color="warning.main">Edge ({currentEdge}/{maxEdge})</Label>

              <ButtonGroup fullWidth>
                <Button
                  color="warning"
                  onClick={handleRerollMisses}
                  disabled={currentEdge <= 0 || edgeSpent || isRolling || !wasRolled}
                >
                  Reroll Misses
                </Button>

                <Button
                  color="warning"
                  onClick={handleEdge}
                  disabled={currentEdge <= 0 || edgeSpent || isRolling}
                >
                  Roll Edge
                </Button>
              </ButtonGroup>
            </Stack>
          )}

          <ButtonGroup fullWidth>
            <Button onClick={handleReset} disabled={!physicalMode && isRolling}>
              Reset
            </Button>

            {isExtendedTest && (
              <Button
                color="primary"
                onClick={handleNextExtendedRoll}
                disabled={!physicalMode && (isRolling || !wasRolled)}
              >
                Next Roll
              </Button>
            )}

            {!physicalMode && (
              <Button variant="contained" onClick={handleRoll} disabled={isRolling}>
                Roll
              </Button>
            )}
          </ButtonGroup>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={() => diceTrayApi.close()} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
