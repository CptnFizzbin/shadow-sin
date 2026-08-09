import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { DetailDialog } from "#/components/ui/dialog/detailDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { Combatant } from "#/lib/stores/initiativeTracker/initiativeTrackerData.ts"
import { AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"

import { PassPips } from "./passPips.tsx"

interface CombatantDetailDialogProps extends ControlledDialogProps<void> {
  combatant: Combatant
}

const CombatantDetailDialog: FC<CombatantDetailDialogProps> = ({ ctrl, combatant }) => {
  const attributeEntries = AttributeOrder
    .filter((key) => combatant.attributes?.[key] !== undefined)
    .map((key) => ({ key, label: AttributeLabels[key], value: combatant.attributes![key]! }))

  const hasResist = combatant.armor !== undefined || combatant.resistBod !== undefined
    || combatant.resistWil !== undefined

  return (
    <DetailDialog ctrl={ctrl} title={combatant.name} dividers>
      <Stack sx={{ gap: 1.5 }}>
        <Stack direction="row" sx={{ gap: 2, justifyContent: "center" }}>
          {combatant.initiativeDice !== undefined && (
            <Typography color="text.secondary">Initiative: {combatant.initiativeDice}</Typography>
          )}
          <Typography color="text.secondary">Score: {combatant.score}</Typography>
        </Stack>

        {attributeEntries.length > 0 && (
          <Stack sx={{ gap: 0.5 }}>
            <Label label="Attributes" />
            <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
              {attributeEntries.map(({ key, label, value }) => (
                <Stack key={key} sx={{ alignItems: "center", minWidth: 32 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>{value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}

        {combatant.skills && combatant.skills.length > 0 && (
          <Stack sx={{ gap: 0.5 }}>
            <Label label="Skills" />
            <Stack sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 0.5, columnGap: 2 }}>
              {combatant.skills.map((skill) => (
                <Stack key={skill.name} direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography>{skill.name}</Typography>
                  <Typography sx={{ fontWeight: "bold" }}>{skill.pool}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}

        {hasResist && (
          <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            {combatant.armor !== undefined && <Typography>Armor: {combatant.armor}</Typography>}
            {combatant.resistBod !== undefined && <Typography>Resist BOD: {combatant.resistBod}</Typography>}
            {combatant.resistWil !== undefined && <Typography>Resist WIL: {combatant.resistWil}</Typography>}
          </Stack>
        )}

        {combatant.damageTracks && combatant.damageTracks.length > 0 && (
          <Stack sx={{ gap: 0.5 }}>
            <Label label="Damage" />
            {combatant.damageTracks.map((track) => (
              <Stack key={track.label} direction="row" sx={{ alignItems: "center" }}>
                <Typography sx={{ minWidth: 16 }}>{track.label}</Typography>
                <PassPips
                  total={track.boxes}
                  completed={Array.from({ length: track.filled }, (_, boxIndex) => boxIndex)}
                />
                <Typography sx={{ flexGrow: 1, textAlign: "right" }} color="text.secondary">
                  Wound Mod: {track.woundMod}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        {combatant.weapons && combatant.weapons.length > 0 && (
          <Stack sx={{ gap: 0.5 }}>
            <Label label="Weapons" />
            {combatant.weapons.map((weapon) => (
              <Typography key={weapon.name}>
                {weapon.name}: {weapon.pool} | DV: {weapon.dv} | AP: {weapon.ap}
                {weapon.modes ? ` | ${weapon.modes}` : ""}
              </Typography>
            ))}
          </Stack>
        )}
      </Stack>
    </DetailDialog>
  )
}

interface UseCombatantDetailDialogProps {
  combatant: Combatant
}

export const useCombatantDetailDialog = () => useDialog<void, UseCombatantDetailDialogProps>(
  (ctrl, props) => <CombatantDetailDialog ctrl={ctrl} combatant={props.combatant} />,
)
