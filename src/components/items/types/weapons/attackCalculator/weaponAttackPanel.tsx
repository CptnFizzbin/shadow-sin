import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { WeaponCard } from "#/components/items/types/weapons/weaponCard.tsx"
import { useActiveSkillRating } from "#/components/runner/runnerUtils.ts"
import { SkillListItem } from "#/components/runner/skills/skillListItem.tsx"
import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { useActiveSkillDicePool } from "#/lib/hooks/runner/skills/skillDicePools.ts"
import { useWoundModifier } from "#/lib/hooks/system/damage/useWoundModifier.ts"
import { useDiceRoller } from "#/lib/hooks/system/dice/useDiceRoller.ts"
import { useEncumbranceDiceGroup } from "#/lib/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import {
  selectAllSettled,
  selectHits,
  selectIsCriticalGlitch,
  selectIsGlitch,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"
import { applyNetHitsToDamage } from "#/system/gear/weaponDamage.ts"
import type { FirearmData, WeaponData } from "#/system/gear/weaponData.ts"
import { isFirearmData, WeaponType } from "#/system/gear/weaponData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { meleeAttackModifiers } from "./weaponAttackCalculatorData.ts"
import { getSkillCandidates } from "./weaponSkillCandidates.ts"

interface WeaponAttackPanelProps {
  weapon: WeaponData
}

type WizardStep = "skill" | "modifiers" | "total"

const wizardSteps: { step: WizardStep, label: string }[] = [
  { step: "skill", label: "Attack Skill" },
  { step: "modifiers", label: "Modifiers" },
  { step: "total", label: "Total" },
]

/** Drilled-down view of the Attack Calculator: a paginated wizard for one weapon. */
export const WeaponAttackPanel: FC<WeaponAttackPanelProps> = ({ weapon }) => {
  const isMelee = weapon.weaponType === WeaponType.melee
  const firearm = isFirearmData(weapon) ? (weapon as FirearmData) : undefined
  const skillOptions = getSkillCandidates(weapon)

  const [stepIndex, setStepIndex] = useState(0)
  const [selectedSkill, setSelectedSkill] = useState<SkillKey>(weapon.skill)
  const [selectedFiremode, setSelectedFiremode] = useState<string | null>(firearm?.firemodes?.[0] ?? null)
  const [includeDefaultingSkills, setIncludeDefaultingSkills] = useState(false)
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({})
  const [stepperValues, setStepperValues] = useState<Record<string, number>>({})
  const [defenseHits, setDefenseHits] = useState(0)

  // Every weapon skill gets a fixed hook call, regardless of what the user has selected, so
  // the hook order never changes when the selection does.
  const archeryRating = useActiveSkillRating(SkillKey.archery)
  const automaticsRating = useActiveSkillRating(SkillKey.automatics)
  const bladesRating = useActiveSkillRating(SkillKey.blades)
  const clubsRating = useActiveSkillRating(SkillKey.clubs)
  const exoticMeleeRating = useActiveSkillRating(SkillKey.exoticMeleeWeapons)
  const exoticRangedRating = useActiveSkillRating(SkillKey.exoticRangedWeapons)
  const gunneryRating = useActiveSkillRating(SkillKey.gunnery)
  const heavyWeaponsRating = useActiveSkillRating(SkillKey.heavyWeapons)
  const longarmsRating = useActiveSkillRating(SkillKey.longarms)
  const pistolsRating = useActiveSkillRating(SkillKey.pistols)
  const thrownWeaponsRating = useActiveSkillRating(SkillKey.thrownWeapons)
  const unarmedCombatRating = useActiveSkillRating(SkillKey.unarmedCombat)

  const skillRatingByKey: Partial<Record<SkillKey, number>> = {
    [SkillKey.archery]: archeryRating,
    [SkillKey.automatics]: automaticsRating,
    [SkillKey.blades]: bladesRating,
    [SkillKey.clubs]: clubsRating,
    [SkillKey.exoticMeleeWeapons]: exoticMeleeRating,
    [SkillKey.exoticRangedWeapons]: exoticRangedRating,
    [SkillKey.gunnery]: gunneryRating,
    [SkillKey.heavyWeapons]: heavyWeaponsRating,
    [SkillKey.longarms]: longarmsRating,
    [SkillKey.pistols]: pistolsRating,
    [SkillKey.thrownWeapons]: thrownWeaponsRating,
    [SkillKey.unarmedCombat]: unarmedCombatRating,
  }

  const visibleSkillOptions = skillOptions.filter(
    (skill) => includeDefaultingSkills || (skillRatingByKey[skill] ?? 0) > 0,
  )
  const resolvedSkill = visibleSkillOptions.includes(selectedSkill)
    ? selectedSkill
    : (visibleSkillOptions[0] ?? skillOptions[0])

  const attrKey = weapon.attribute ?? skillList[resolvedSkill].attr
  const affectedByEncumbrance = attrKey === AttributeKey.agility || attrKey === AttributeKey.reaction

  const skillPool = useActiveSkillDicePool({ skillKey: resolvedSkill, attrOverride: weapon.attribute })
  const encumbranceGroup = useEncumbranceDiceGroup()
  const woundMod = useWoundModifier()

  const modifierGroups: DiceGroupList = isMelee
    ? meleeAttackModifiers.map((modifier) => {
        if (modifier.kind === "toggle") {
          if (!toggleValues[modifier.id]) return null
          return {
            id: modifier.id,
            name: modifier.label,
            size: modifier.value,
            color: modifier.value >= 0 ? "success.main" : "error.main",
          }
        }

        const count = stepperValues[modifier.id] ?? 0
        if (count === 0) return null
        return {
          id: modifier.id,
          name: `${modifier.label} (${count})`,
          size: modifier.perUnit * count,
          color: modifier.perUnit >= 0 ? "success.main" : "error.main",
        }
      })
    : []

  const groups: DiceGroupList = [
    skillPool.groups,
    affectedByEncumbrance ? encumbranceGroup : null,
    ...modifierGroups,
  ]
  const poolTotal = getPoolSize(groups.flat())

  const diceRoller = useDiceRoller(poolTotal)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const rolledHits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)
  const isSettled = useDiceRollerSelector(diceRoller, selectAllSettled)

  const netHits = hasRolled ? rolledHits - defenseHits : null
  const totalDV = netHits === null ? null : (netHits > 0 ? applyNetHitsToDamage(weapon.dmg, netHits) : "Miss")

  const currentStep = wizardSteps[stepIndex].step
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === wizardSteps.length - 1

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="overline" color="text.secondary">
        Step {stepIndex + 1} of {wizardSteps.length} — {wizardSteps[stepIndex].label}
      </Typography>

      {currentStep === "skill" && (
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

          <Stack>
            {visibleSkillOptions.map((skill) => {
              const isSelected = skill === resolvedSkill
              const rating = skillRatingByKey[skill] ?? 0
              const defaultable = skillList[skill].defaultable ?? true
              const isDefaulted = rating === 0 && defaultable

              return (
                <Box
                  key={skill}
                  sx={{
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: isSelected ? "secondary.main" : "divider",
                    backgroundColor: isSelected ? "action.selected" : undefined,
                  }}
                >
                  <SkillListItem
                    name={skill}
                    rating={rating}
                    attr={weapon.attribute ?? skillList[skill].attr}
                    isDefaulted={isDefaulted}
                    onClick={() => setSelectedSkill(skill)}
                  />
                </Box>
              )
            })}
          </Stack>

          <FormControlLabel
            control={(
              <Checkbox
                checked={includeDefaultingSkills}
                onChange={(event) => setIncludeDefaultingSkills(event.target.checked)}
              />
            )}
            label="Show Defaulting Skills"
          />
        </Stack>
      )}

      {currentStep === "modifiers" && (
        <Stack>
          {woundMod >= 1 && (
            <FormControlLabel
              control={<Checkbox checked disabled />}
              label={`Wounded (-${woundMod})`}
            />
          )}

          {!isMelee && (
            <Typography variant="body2" color="text.secondary">
              The Melee Modifier Table only applies to melee attacks — this weapon's pool isn't
              adjusted here.
            </Typography>
          )}

          {isMelee && meleeAttackModifiers.map((modifier) => {
            if (modifier.kind === "toggle") {
              return (
                <FormControlLabel
                  key={modifier.id}
                  control={(
                    <Checkbox
                      checked={toggleValues[modifier.id] ?? false}
                      onChange={(event) =>
                        setToggleValues((prev) => ({ ...prev, [modifier.id]: event.target.checked }))}
                    />
                  )}
                  label={`${modifier.label} (${modifier.value >= 0 ? "+" : ""}${modifier.value})`}
                />
              )
            }

            return (
              <Stack key={modifier.id} direction="row" sx={{ alignItems: "center" }}>
                <Typography variant="body2" sx={{ flex: 1 }}>{modifier.label}</Typography>
                <CounterInput
                  value={stepperValues[modifier.id] ?? 0}
                  onChange={(value) => setStepperValues((prev) => ({ ...prev, [modifier.id]: value ?? 0 }))}
                  min={modifier.min}
                  max={modifier.max}
                  size="small"
                />
              </Stack>
            )
          })}
        </Stack>
      )}

      {currentStep === "total" && (
        <Stack sx={{ gap: 1.5 }}>
          <WeaponCard.DicePool name="Attack" groups={groups} />

          <Stack sx={{ alignItems: "center" }}>
            <DiceResult roller={diceRoller} iconSize={32} />

            {isSettled && isCriticalGlitch && (
              <Label label="CRITICAL GLITCH!" color="error.main" variant="contained" />
            )}
            {isSettled && !isCriticalGlitch && isGlitch && (
              <Label label="Glitch!" color="error.main" variant="text" />
            )}

            <Button
              variant="contained"
              onClick={() => {
                diceRoller.reset()
                diceRoller.rollAll()
              }}
              fullWidth
            >
              {hasRolled ? "Reroll Attack Test" : "Roll Attack Test"}
            </Button>
          </Stack>

          <Divider />

          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Hits rolled on the defender's Defense Test
            </Typography>
            <CounterInput
              label="Defense Hits"
              value={defenseHits}
              onChange={(newValue) => setDefenseHits(newValue ?? 0)}
              min={0}
              max={99}
            />
          </Stack>

          <Grid container spacing={1} columns={2}>
            <Grid size={1}>
              <Label label="Net Hits" variant="outlined" />
              <Typography
                sx={{ textAlign: "center" }}
                color={netHits !== null && netHits > 0 ? "success.main" : netHits !== null && netHits < 0 ? "error.main" : undefined}
              >
                {netHits ?? "—"}
              </Typography>
            </Grid>
            <Grid size={1}>
              <Label label="Total DV" variant="outlined" />
              <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
                {totalDV ?? weapon.dmg}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      )}

      <Divider />

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button disabled={isFirstStep} onClick={() => setStepIndex((index) => index - 1)}>
          Back
        </Button>

        {!isLastStep && (
          <Button variant="contained" color="secondary" onClick={() => setStepIndex((index) => index + 1)}>
            Next
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
