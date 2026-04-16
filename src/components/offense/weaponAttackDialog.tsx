import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useActiveSkillRating } from "#/components/character/characterUtils.ts"
import { DicePool } from "#/components/dicePool/dicePool.tsx"
import { useAttrDiceGroup, useWoundDiceGroup } from "#/components/dicePool/useDiceGroup.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { FirearmData, WeaponData } from "#/lib/system/gear/weaponData.ts"
import { isFirearmData } from "#/lib/system/gear/weaponData.ts"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"

interface WeaponAttackDialogProps {
  weapon: WeaponData
  open: boolean
  onClose: () => void
}

/** Derive a relevant SkillKey from the weapon skill string. Returns null if unrecognised. */
function getWeaponSkillKey(weapon: WeaponData): SkillKey | null {
  const skill = weapon.skill?.toLowerCase() ?? ""
  if (skill.includes("pistol")) return SkillKey.pistols
  if (skill.includes("automatics")) return SkillKey.automatics
  if (skill.includes("heavy")) return SkillKey.heavyWeapons
  if (skill.includes("blade")) return SkillKey.blades
  if (skill.includes("unarmed")) return SkillKey.unarmedCombat
  if (skill.includes("exotic melee")) return SkillKey.exoticMeleeWeapons
  if (skill.includes("exotic ranged")) return SkillKey.exoticRangedWeapons
  return null
}

interface AttackDicePoolProps {
  weapon: WeaponData
}

const AttackDicePool: FC<AttackDicePoolProps> = ({ weapon }) => {
  const attrKey = weapon.attribute ?? AttributeKey.agility
  const skillKey = getWeaponSkillKey(weapon)
  const attrGroup = useAttrDiceGroup(attrKey)
  const skillRating = useActiveSkillRating(skillKey ?? SkillKey.unarmedCombat)
  const woundGroup = useWoundDiceGroup()

  const skillLabel = weapon.skill ?? (skillKey === null ? "No Skill" : "Combat Skill")
  const skillGroup = { name: skillLabel, size: skillRating }

  return (
    <DicePool
      name="Attack"
      groups={[attrGroup, skillGroup, woundGroup]}
    />
  )
}

export const WeaponAttackDialog: FC<WeaponAttackDialogProps> = ({
  weapon,
  open,
  onClose,
}) => {
  const isFirearm = isFirearmData(weapon)
  const firearm = isFirearm ? (weapon as FirearmData) : undefined

  const [selectedFiremode, setSelectedFiremode] = useState<string | null>(
    firearm?.firemodes[0] ?? null,
  )

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0 }}>{weapon.name}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack gap={1.5}>
          {isFirearm && firearm && firearm.firemodes.length > 0 && (
            <Stack gap={0.5}>
              <Label label="Fire Mode" />
              <ButtonGroup size="small" variant="outlined" fullWidth>
                {firearm.firemodes.map((mode) => (
                  <Button
                    key={mode}
                    variant={selectedFiremode === mode ? "contained" : "outlined"}
                    onClick={() => setSelectedFiremode(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </ButtonGroup>
              {selectedFiremode && (
                <UnderConstruction
                  title="Fire Mode Effects"
                  description="Fire mode modifiers (recoil, burst fire DV bonus, suppressive fire) are not yet implemented."
                />
              )}
            </Stack>
          )}

          <Grid container spacing={1} columns={2}>
            {weapon.dmg && (
              <Grid size={1}>
                <Label label="DV" variant="outlined" />
                <Typography textAlign="center">{weapon.dmg}</Typography>
              </Grid>
            )}
            {weapon.ap !== undefined && weapon.ap !== 0 && (
              <Grid size={1}>
                <Label label="AP" variant="outlined" />
                <Typography textAlign="center">{weapon.ap}</Typography>
              </Grid>
            )}
            {isFirearm && firearm && (
              <Grid size={1}>
                <Label label="Ammo" variant="outlined" />
                <Typography textAlign="center">
                  {firearm.ammo.remaining}/{firearm.ammo.size}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider />

          <AttackDicePool weapon={weapon} />

          <Button onClick={onClose} color="secondary" size="small">
            Close
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}