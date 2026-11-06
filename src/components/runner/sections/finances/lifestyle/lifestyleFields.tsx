import FormControl from "@mui/material/FormControl"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { Nuyen } from "#/components/ui/nuyen.tsx"
import { LifestyleSelectors } from "#/state/runner/lifestyle/lifestyle.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { Lifestyles, LifestyleType } from "#/system/model/finances/lifestyleType.ts"

const CUSTOM_OPTION = "Custom"

/** Editor for the Runner's lifestyle: a standard lifestyle or a custom one with its own upkeep or income, plus notes. */
export const LifestyleFields: FC = () => {
  const dispatch = useRunnerStoreDispatch()

  const name = useRunnerSelector(LifestyleSelectors.selectName)
  const upkeep = useRunnerSelector(LifestyleSelectors.selectUpkeep)
  const notes = useRunnerSelector(LifestyleSelectors.selectNotes)
  const standardType = useRunnerSelector(LifestyleSelectors.selectStandardType)

  // Remembered locally so a custom lifestyle whose name and upkeep happen to match a standard one
  // (e.g. while typing "Low") doesn't snap back to the standard option and hide the custom fields.
  const [customSelected, setCustomSelected] = useState(standardType === null)
  const isCustom = customSelected || standardType === null

  // Remembered locally because an upkeep of zero carries no sign to tell cost and income apart.
  const [incomeSelected, setIncomeSelected] = useState(upkeep < 0)
  const isIncome = upkeep < 0 || (upkeep === 0 && incomeSelected)

  const handleTypeChange = (value: string) => {
    if (value === CUSTOM_OPTION) {
      setCustomSelected(true)
      dispatch(Actions.lifestyle.patchLifestyle({ name: CUSTOM_OPTION }))
      return
    }

    setCustomSelected(false)
    setIncomeSelected(false)
    dispatch(Actions.lifestyle.setStandardLifestyle(value as LifestyleType))
  }

  const handleAmountChange = (rawAmount: string) => {
    const amount = Math.max(0, parseInt(rawAmount, 10) || 0)
    dispatch(Actions.lifestyle.patchLifestyle({ upkeep: isIncome ? -amount : amount }))
  }

  const handleIncomeChange = (income: boolean) => {
    setIncomeSelected(income)
    const amount = Math.abs(upkeep)
    dispatch(Actions.lifestyle.patchLifestyle({ upkeep: income ? -amount : amount }))
  }

  return (
    <Stack>
      <FormControl fullWidth size="small">
        <InputLabel id="lifestyle-type-label">Lifestyle</InputLabel>
        <Select
          labelId="lifestyle-type-label"
          label="Lifestyle"
          value={isCustom ? CUSTOM_OPTION : (standardType ?? CUSTOM_OPTION)}
          onChange={(event) => handleTypeChange(event.target.value)}
          renderValue={(value) => value}
        >
          {Object.values(LifestyleType).map((type) => (
            <MenuItem
              key={type}
              value={type}
              sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
            >
              <Typography>{type}</Typography>
              <Typography variant="caption" color="secondary">
                <Nuyen amount={Lifestyles[type].upkeep} />/m
              </Typography>
            </MenuItem>
          ))}
          <MenuItem value={CUSTOM_OPTION}>
            <Typography>{CUSTOM_OPTION}</Typography>
          </MenuItem>
        </Select>
      </FormControl>

      {isCustom && (
        <>
          <TextField
            label="Name"
            size="small"
            fullWidth
            value={name}
            onChange={(event) => dispatch(Actions.lifestyle.patchLifestyle({ name: event.target.value }))}
          />

          <Stack direction="row" sx={{ alignItems: "center" }}>
            <TextField
              label={isIncome ? "Monthly income" : "Monthly upkeep"}
              type="number"
              size="small"
              fullWidth
              value={Math.abs(upkeep)}
              onChange={(event) => handleAmountChange(event.target.value)}
              slotProps={{
                htmlInput: { min: 0 },
                input: { startAdornment: <InputAdornment position="start">¥</InputAdornment> },
              }}
            />

            <ToggleButtonGroup
              exclusive
              size="small"
              value={isIncome ? "income" : "upkeep"}
              onChange={(_event, value: string | null) => {
                if (value) handleIncomeChange(value === "income")
              }}
              aria-label="Upkeep or income"
            >
              <ToggleButton value="upkeep">Upkeep</ToggleButton>
              <ToggleButton value="income" color="success">Income</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </>
      )}

      <TextField
        label="Notes"
        size="small"
        fullWidth
        multiline
        minRows={2}
        value={notes}
        onChange={(event) => dispatch(Actions.lifestyle.patchLifestyle({ notes: event.target.value || undefined }))}
      />
    </Stack>
  )
}
