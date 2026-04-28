import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import pluralize from "pluralize"
import type { FC } from "react"

import type { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { TestType } from "#/components/dice/testType.ts"
import { Label } from "#/components/ui/text/label.tsx"
import {
  selectHits,
  selectRollState,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"
import { RollState } from "#/system/dice/rollState.ts"

interface DiceTrayResultLabelsProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayResultLabels: FC<DiceTrayResultLabelsProps> = ({ diceTrayApi }) => {
  const threshold = useSelector(diceTrayApi.store, (state) => state.threshold)
  const testType = useSelector(diceTrayApi.store, (state) => state.testType)
  const opposedHits = useSelector(diceTrayApi.store, (state) => state.opposedHits)
  const extendedHistory = useSelector(diceTrayApi.store, (state) => state.extendedHistory)
  const physicalMode = useSelector(diceTrayApi.store, (state) => state.physicalMode)
  const physicalHits = useSelector(diceTrayApi.store, (state) => state.physicalHits)

  const wasRolled = useDiceRollerSelector(diceTrayApi.roller, selectWasRolled)
  const rolledHits = useDiceRollerSelector(diceTrayApi.roller, selectHits)
  const rollState = useDiceRollerSelector(diceTrayApi.roller, selectRollState)

  const isExtendedTest = testType === TestType.Extended
  const isOpposedTest = testType === TestType.Opposed
  const isStandardTest = testType === TestType.Standard

  const currentHits = physicalMode ? physicalHits : rolledHits
  const previousExtendedHits = extendedHistory.reduce((sum, entry) => sum + entry.hits, 0)
  const totalExtendedHits = previousExtendedHits + (wasRolled || physicalMode ? currentHits : 0)
  const netHits = Math.max(0, currentHits - opposedHits)

  return (
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
        <Label label={rolledHits >= threshold ? "Success!" : "Miss"} variant="text" />
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
            + (extendedHistory.length > 0
              ? ` (after ${extendedHistory.length} ${pluralize("roll", extendedHistory.length)})`
              : "")}
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
  )
}
