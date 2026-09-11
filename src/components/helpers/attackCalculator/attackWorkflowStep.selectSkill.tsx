import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { SkillSelectList } from "#/components/runner/skills/skillSelectList.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import type { FirearmData } from "#/system/gear/weaponData.ts"
import { isFirearmData } from "#/system/gear/weaponData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { useActiveAttackWeapon, useAttackWorkflow } from "./attackWorkflow.ts"
import { getSkillCandidates } from "./weaponSkillCandidates.ts"

/** Attack Skill step: weapon stats, fire mode (firearms), and the skill picker. */
export const AttackWorkflowStepSelectSkill: FC = () => {
  const workflow = useAttackWorkflow()
  const weapon = useActiveAttackWeapon()

  const [showAllSkills, setShowAllSkills] = useState(false)

  const firearm = isFirearmData(weapon) ? (weapon as FirearmData) : undefined
  const skillOptions = getSkillCandidates(weapon)
  const otherSkillOptions = skillOptions.filter((skill) => skill !== weapon.skill)
  // The weapon's default skill is always offered, regardless of the "Show Defaulting Skills"
  // filter — it's the weapon's own configured skill, not a defaulting alternative to discover.
  const resolvedSkill = workflow.data.selectedSkill === weapon.skill || otherSkillOptions.includes(workflow.data.selectedSkill as SkillKey)
    ? (workflow.data.selectedSkill ?? weapon.skill)
    : weapon.skill

  const handleSelectSkill = (skill: SkillKey) => {
    workflow.setData((data) => {
      data.selectedSkill = skill
    })
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Grid container spacing={1} columns={2}>
        {weapon.dmg && (
          <Grid size={1}>
            <Label label="DV" variant="outlined" />
            <Typography sx={{ textAlign: "center" }}>{weapon.dmg}</Typography>
          </Grid>
        )}
        {weapon.ap !== undefined && weapon.ap !== 0 && (
          <Grid size={1}>
            <Label label="AP" variant="outlined" />
            <Typography sx={{ textAlign: "center" }}>{weapon.ap}</Typography>
          </Grid>
        )}
        {firearm?.ammo && (
          <Grid size={1}>
            <Label label="Ammo" variant="outlined" />
            <Typography sx={{ textAlign: "center" }}>
              {firearm.ammo.remaining}/{firearm.ammo.size}
            </Typography>
          </Grid>
        )}
      </Grid>

      {firearm && (firearm.firemodes?.length ?? 0) > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Fire Mode" />
          <ButtonGroup size="small" variant="outlined" fullWidth>
            {firearm.firemodes!.map((mode) => (
              <Button
                key={mode}
                variant={workflow.data.selectedFiremode === mode ? "contained" : "outlined"}
                onClick={() => workflow.setData((prev) => ({ ...prev, selectedFiremode: mode }))}
              >
                {mode}
              </Button>
            ))}
          </ButtonGroup>
          {workflow.data.selectedFiremode && (
            <UnderConstruction
              title="Fire Mode Effects"
              description="Fire mode modifiers (recoil, burst fire DV bonus, suppressive fire) are not yet implemented."
            />
          )}
        </Stack>
      )}

      <Stack sx={{ gap: 1.5 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Default Skill" />
          <SkillSelectList
            skills={[weapon.skill]}
            selectedSkill={resolvedSkill}
            onSelectSkill={handleSelectSkill}
            attrOverride={weapon.attribute}
          />
        </Stack>

        {otherSkillOptions.length > 0 && (
          <Stack sx={{ gap: 0.5 }}>
            <Label label="Other Skills" />
            <SkillSelectList
              skills={otherSkillOptions}
              selectedSkill={resolvedSkill}
              onSelectSkill={handleSelectSkill}
              attrOverride={weapon.attribute}
              includeDefaulting={showAllSkills}
            />
          </Stack>
        )}
      </Stack>

      <FormControlLabel
        control={(
          <Checkbox
            checked={showAllSkills}
            onChange={(event) => setShowAllSkills(event.target.checked)}
          />
        )}
        label="Show Defaulting Skills"
      />
    </Stack>
  )
}
