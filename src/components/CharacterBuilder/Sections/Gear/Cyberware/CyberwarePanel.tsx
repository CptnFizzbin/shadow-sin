import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CyberwareList } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/CyberwareList.tsx"
import { BASE_ESSENCE } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/ImplantUtils.ts"
import { useCyberwareState } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/UseCyberwareState.ts"

export const CyberwarePanel: FC = () => {
  const { implants, addImplant, updateImplant, removeImplant, essenceSummary } =
    useCyberwareState()

  const essenceRemainingDisplay = essenceSummary.remainingEssence.toFixed(2)
  const isEssenceWarning = essenceSummary.remainingEssence <= 1
  const isEssenceError = essenceSummary.remainingEssence <= 0

  return (
    <Stack gap={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 0.5 }}
      >
        <Typography variant="caption" color="text.secondary">
          Essence Used:
          {" "}
          {essenceSummary.effectiveEssenceUsed.toFixed(2).replace(/\.?0+$/, "")}
        </Typography>
        <Typography
          variant="caption"
          color={
            isEssenceError
              ? "error"
              : isEssenceWarning
                ? "warning.main"
                : "text.secondary"
          }
        >
          Remaining: {essenceRemainingDisplay} / {BASE_ESSENCE}
        </Typography>
      </Stack>

      {isEssenceError && (
        <Alert severity="error" sx={{ py: 0 }}>
          Essence depleted! Implants exceed the maximum essence of
          {" "}
          {BASE_ESSENCE}
          .
        </Alert>
      )}

      {essenceSummary.cyberwareTotal > 0 && essenceSummary.biowareTotal > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
          Cyber:
          {" "}
          {essenceSummary.cyberwareTotal.toFixed(2)}
          {" "}
          | Bio:
          {" "}
          {essenceSummary.biowareTotal.toFixed(2)}
          {" "}
          (higher applied full, other
          at ½)
        </Typography>
      )}

      <CyberwareList
        implants={implants}
        onAdd={addImplant}
        onUpdate={updateImplant}
        onRemove={removeImplant}
        label="Implant"
      />
    </Stack>
  )
}
