import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { CounterField } from "#/components/ui/counter/counterField.tsx"
import { selectIsRolling, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"

import { useDiceTray } from "./diceTrayContext.ts"
import {
  ExtendedInterval,
  ExtendedIntervalLabels,
  TestType,
} from "./testType.ts"

export const DiceTrayInputs: FC = () => {
  const diceTrayApi = useDiceTray()
  const threshold = useSelector(diceTrayApi.store, (state) => state.threshold)
  const poolSize = useSelector(diceTrayApi.store, (state) => state.poolSize)
  const testType = useSelector(diceTrayApi.store, (state) => state.testType)
  const opposedHits = useSelector(diceTrayApi.store, (state) => state.opposedHits)
  const extendedInterval = useSelector(diceTrayApi.store, (state) => state.extendedInterval)
  const shrinkingPool = useSelector(diceTrayApi.store, (state) => state.shrinkingPool)
  const isRolling = useDiceRollerSelector(diceTrayApi.roller, selectIsRolling)

  const isExtendedTest = testType === TestType.Extended
  const isOpposedTest = testType === TestType.Opposed
  const isStandardTest = testType === TestType.Standard

  return (
    <Stack>
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
    </Stack>
  )
}
