import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"

import { useSpendKarmaDialogContext } from "./spendKarmaDialogContext.tsx"

const attributeKarmaCost = (newRating: number) => 5 * newRating

export const SpendKarmaAttributeTab: FC = () => {
  const {
    availableAttributes,
    selectedAttribute,
    setSelectedAttribute,
    attributes,
    attrInfos,
  } = useSpendKarmaDialogContext()

  if (availableAttributes.length === 0) {
    return (
      <Typography color="text.secondary">
        All attributes are already at their natural maximum.
      </Typography>
    )
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Attribute</InputLabel>
      <Select
        value={selectedAttribute}
        label="Attribute"
        onChange={(e) => setSelectedAttribute(e.target.value as AttributeKey)}
      >
        {availableAttributes.map((key) => {
          const currentValue = attributes[key]
          const newValue = currentValue + 1
          const cost = attributeKarmaCost(newValue)
          return (
            <MenuItem key={key} value={key}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                <Typography>{AttributeLabels[key]}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                  {currentValue} → {newValue} / {attrInfos[key].max} &nbsp;·&nbsp; {cost} karma
                </Typography>
              </Stack>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
