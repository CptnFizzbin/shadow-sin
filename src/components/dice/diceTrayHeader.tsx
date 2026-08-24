import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import type { FC } from "react"

import { useDiceTray } from "#/contexts/dice/diceTrayContext.ts"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"

import { TestType, TestTypeLabels } from "./testType.ts"

export const DiceTrayHeader: FC = () => {
  const diceTrayApi = useDiceTray()
  const testType = useSelector(diceTrayApi.store, (state) => state.testType)
  const physicalMode = useSelector(diceTrayApi.store, (state) => state.physicalMode)

  return (
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
  )
}
