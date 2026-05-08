import AddIcon from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useAllAttrInfos } from "#/components/character/characterUtils.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { AttributeKey, AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import { calcAttributeKarmaCost } from "./improvementsKarmaCost.ts"
import type { AttributeImprovement } from "./types/attributeImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"

export const AttributeTab: FC = () => {
  const { improvementsStore } = useSpendKarmaDialogContext()
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeKey | "">("")
  const attributes = useCharacterSheetSelector((sheet) => sheet.attributes)
  const attrInfos = useAllAttrInfos()

  const queuedAttributes = useSelector(
    improvementsStore.store,
    (state) => new Set(
      state.improvements
        .filter((i): i is AttributeImprovement => i.type === ImprovementType.Attribute)
        .map((i) => i.attribute),
    ),
  )

  const availableAttributes = AttributeOrder.filter((key) => {
    if (key === AttributeKey.essence) return false
    if (queuedAttributes.has(key)) return false
    const info = attrInfos[key]
    const currentValue = attributes[key]
    return info.max > 0 && currentValue < info.max
  })

  const handleAdd = () => {
    if (!selectedAttribute) return
    const currentValue = attributes[selectedAttribute]
    improvementsStore.improveAttribute(selectedAttribute, currentValue + 1)
    setSelectedAttribute("")
  }

  if (availableAttributes.length === 0) {
    return (
      <Typography color="text.secondary">
        All attributes are already at their natural maximum.
      </Typography>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Attribute</InputLabel>
        <Select
          value={selectedAttribute}
          label="Attribute"
          onChange={(event) => setSelectedAttribute(event.target.value as AttributeKey | "")}
        >
          {availableAttributes.map((key) => {
            const currentValue = attributes[key]
            const newValue = currentValue + 1
            const cost = calcAttributeKarmaCost(newValue)
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

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={!selectedAttribute}
        onClick={handleAdd}
        fullWidth
      >
        Add Attribute
      </Button>
    </Stack>
  )
}
