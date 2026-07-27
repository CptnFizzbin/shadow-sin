import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useActiveSkillRating } from "#/components/runner/runnerUtils.ts"
import { SkillListItem } from "#/components/runner/skills/skillListItem.tsx"
import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import { useWoundModifier } from "#/components/system/damage/useWoundModifier.ts"
import type { DiceGroup, DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import {
  useActiveSkillDiceGroup,
  useDefaultingDiceGroup,
  useEncumbranceDiceGroup,
  useWoundDiceGroup,
} from "#/components/system/dicePool/useDiceGroup.ts"
import { useEncumbrance } from "#/components/system/encumbrance/useEncumbrance.ts"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useAttrValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey, AttributeLabels } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import type { DefenseAttackType } from "./defenseCalculatorData.ts"
import {
  defenseModifiersForAttackType,
  defenseSkillGroupOrder,
  defenseSkillOptionsByAttackType,
} from "./defenseCalculatorData.ts"

interface DefenseCalculatorPanelProps {
  attackType: DefenseAttackType
}

type SpellAttribute = "physical" | "mana"
type ArmorType = "ballistic" | "impact"
type CounterspellingSource = "self" | "other"
type WizardStep = "skill" | "modifiers" | "total" | "resist"

const wizardSteps: { step: WizardStep, label: string }[] = [
  { step: "skill", label: "Defense Skill" },
  { step: "modifiers", label: "Modifiers" },
  { step: "total", label: "Total" },
  { step: "resist", label: "Resist Damage" },
]

interface SkillDefenseEntry {
  rating: number
  diceGroup: DiceGroup
  defaultingGroup: DiceGroup | null
}

/** Drilled-down view of the Defense Calculator: a paginated wizard for one attack type. */
export const DefenseCalculatorPanel: FC<DefenseCalculatorPanelProps> = ({ attackType }) => {
  const skillOptions = defenseSkillOptionsByAttackType[attackType]
  const modifiers = defenseModifiersForAttackType(attackType)

  const [stepIndex, setStepIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(skillOptions[0].key)
  const [includeDefaultingSkills, setIncludeDefaultingSkills] = useState(false)
  const [spellAttribute, setSpellAttribute] = useState<SpellAttribute>("physical")
  const [counterspellingEnabled, setCounterspellingEnabled] = useState(false)
  const [counterspellingSource, setCounterspellingSource] = useState<CounterspellingSource>("self")
  const [otherRating, setOtherRating] = useState(0)
  const [unaware, setUnaware] = useState(false)
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({})
  const [stepperValues, setStepperValues] = useState<Record<string, number>>({})
  const [choiceValues, setChoiceValues] = useState<Record<string, string>>({})
  const [armorType, setArmorType] = useState<ArmorType>("ballistic")

  const dispatch = useRunnerStoreDispatch()
  const physicalTrack = useRunnerStoreSelector(Selectors.damage.selectPhysicalTrack)
  const stunTrack = useRunnerStoreSelector(Selectors.damage.selectStunTrack)

  // Every skill any attack type can reference gets a fixed hook call, regardless of what the
  // user has selected, so the hook order never changes when the selection does.
  const reaction = useAttrValue(AttributeKey.reaction)
  const body = useAttrValue(AttributeKey.body)
  const willpower = useAttrValue(AttributeKey.willpower)

  const dodgeRating = useActiveSkillRating(SkillKey.dodge)
  const dodgeGroup = useActiveSkillDiceGroup(SkillKey.dodge)
  const dodgeDefaulting = useDefaultingDiceGroup(SkillKey.dodge)

  const unarmedRating = useActiveSkillRating(SkillKey.unarmedCombat)
  const unarmedGroup = useActiveSkillDiceGroup(SkillKey.unarmedCombat)
  const unarmedDefaulting = useDefaultingDiceGroup(SkillKey.unarmedCombat)

  const bladesRating = useActiveSkillRating(SkillKey.blades)
  const bladesGroup = useActiveSkillDiceGroup(SkillKey.blades)
  const bladesDefaulting = useDefaultingDiceGroup(SkillKey.blades)

  const clubsRating = useActiveSkillRating(SkillKey.clubs)
  const clubsGroup = useActiveSkillDiceGroup(SkillKey.clubs)
  const clubsDefaulting = useDefaultingDiceGroup(SkillKey.clubs)

  const counterspellingRating = useActiveSkillRating(SkillKey.counterspelling)
  const counterspellingGroup = useActiveSkillDiceGroup(SkillKey.counterspelling)
  const counterspellingDefaulting = useDefaultingDiceGroup(SkillKey.counterspelling)

  const skillDataByKey: Partial<Record<SkillKey, SkillDefenseEntry>> = {
    [SkillKey.dodge]: { rating: dodgeRating, diceGroup: dodgeGroup, defaultingGroup: dodgeDefaulting },
    [SkillKey.unarmedCombat]: { rating: unarmedRating, diceGroup: unarmedGroup, defaultingGroup: unarmedDefaulting },
    [SkillKey.blades]: { rating: bladesRating, diceGroup: bladesGroup, defaultingGroup: bladesDefaulting },
    [SkillKey.clubs]: { rating: clubsRating, diceGroup: clubsGroup, defaultingGroup: clubsDefaulting },
    [SkillKey.counterspelling]: {
      rating: counterspellingRating,
      diceGroup: counterspellingGroup,
      defaultingGroup: counterspellingDefaulting,
    },
  }

  const woundMod = useWoundModifier()
  const woundGroup = useWoundDiceGroup()
  const encumbranceGroup = useEncumbranceDiceGroup()
  const armorTotals = useEncumbrance()

  const visibleSkillOptions = skillOptions.filter((option) => {
    if (!option.skill) return true
    if (includeDefaultingSkills) return true
    return (skillDataByKey[option.skill]?.rating ?? 0) > 0
  })

  const selectedOption = visibleSkillOptions.find((option) => option.key === selectedKey)
    ?? visibleSkillOptions[0]
    ?? skillOptions[0]

  const selectedSkillEntry = selectedOption.skill ? skillDataByKey[selectedOption.skill] : undefined

  const baseAttr = attackType === "spell"
    ? (spellAttribute === "physical" ? AttributeKey.body : AttributeKey.willpower)
    : AttributeKey.reaction

  const attributeGroup: DiceGroup = {
    name: AttributeLabels[baseAttr],
    size: attackType === "spell" ? (spellAttribute === "physical" ? body : willpower) : reaction,
  }

  const spellSkillGroup: DiceGroup | null = attackType === "spell" && counterspellingEnabled
    ? (counterspellingSource === "self"
        ? counterspellingGroup
        : { id: "counterspelling-other", name: "Counterspelling (Other)", size: otherRating })
    : null

  const spellDefaultingGroup: DiceGroup | null = attackType === "spell"
    && counterspellingEnabled
    && counterspellingSource === "self"
    ? counterspellingDefaulting
    : null

  const skillGroupForTotal = attackType === "spell" ? spellSkillGroup : (selectedSkillEntry?.diceGroup ?? null)
  const defaultingGroupForTotal = attackType === "spell"
    ? spellDefaultingGroup
    : (selectedSkillEntry?.defaultingGroup ?? null)

  // Full Dodge (and similar maneuvers) counts the same skill twice — e.g. Reaction + Dodge + Dodge.
  const doubledSkillGroup: DiceGroup | null = attackType !== "spell" && selectedOption.doubleSkill && selectedSkillEntry?.diceGroup
    ? { ...selectedSkillEntry.diceGroup, id: `${selectedSkillEntry.diceGroup.id ?? selectedOption.key}-double` }
    : null

  const modifierGroups: DiceGroupList = modifiers.map((modifier) => {
    if (modifier.kind === "toggle") {
      if (!toggleValues[modifier.id]) return null
      return {
        id: modifier.id,
        name: modifier.label,
        size: modifier.value,
        color: modifier.value >= 0 ? "success.main" : "error.main",
      }
    }

    if (modifier.kind === "stepper") {
      const enabled = toggleValues[modifier.id] ?? false
      const count = stepperValues[modifier.id] ?? 0
      if (!enabled || count === 0) return null
      return {
        id: modifier.id,
        name: `${modifier.label} (${count})`,
        size: modifier.perUnit * count,
        color: "error.main",
      }
    }

    const chosenKey = choiceValues[modifier.id] ?? modifier.options[0].key
    const chosenOption = modifier.options.find((option) => option.key === chosenKey) ?? modifier.options[0]
    if (chosenOption.value === 0) return null
    return {
      id: modifier.id,
      name: `${modifier.label}: ${chosenOption.label}`,
      size: chosenOption.value,
      color: chosenOption.value >= 0 ? "success.main" : "error.main",
    }
  })

  const groups: DiceGroupList = [
    attributeGroup,
    skillGroupForTotal,
    doubledSkillGroup,
    defaultingGroupForTotal,
    woundGroup,
    attackType !== "spell" ? encumbranceGroup : null,
    ...modifierGroups,
  ]

  // Spells bypass armor in SR4e — only melee/ranged damage gets the worn armor's protection.
  const resistAttr = attackType === "spell"
    ? (spellAttribute === "physical" ? AttributeKey.body : AttributeKey.willpower)
    : AttributeKey.body

  const resistAttrValue = attackType === "spell"
    ? (spellAttribute === "physical" ? body : willpower)
    : body

  const armorValue = armorType === "ballistic" ? armorTotals.totalBallistic : armorTotals.totalImpact

  const resistGroups: DiceGroupList = [
    { name: AttributeLabels[resistAttr], size: resistAttrValue },
    attackType !== "spell"
      ? { name: `Armor (${armorType === "ballistic" ? "Ballistic" : "Impact"})`, size: armorValue, color: "info.main" }
      : null,
  ]

  const currentStep = wizardSteps[stepIndex].step
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === wizardSteps.length - 1

  const groupedSkillOptions = defenseSkillGroupOrder
    .map((group) => ({ group, options: visibleSkillOptions.filter((option) => option.group === group) }))
    .filter(({ options }) => options.length > 0)

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="overline" color="text.secondary">
        Step {stepIndex + 1} of {wizardSteps.length} — {wizardSteps[stepIndex].label}
      </Typography>

      {currentStep === "skill" && (
        <Stack sx={{ gap: 1.5 }}>
          {attackType === "spell" && (
            <Stack sx={{ gap: 0.5 }}>
              <Label label="Spell Type" />
              <ButtonGroup size="small" variant="outlined" fullWidth>
                <Button
                  variant={spellAttribute === "physical" ? "contained" : "outlined"}
                  onClick={() => setSpellAttribute("physical")}
                >
                  Physical (Body)
                </Button>
                <Button
                  variant={spellAttribute === "mana" ? "contained" : "outlined"}
                  onClick={() => setSpellAttribute("mana")}
                >
                  Mana (Willpower)
                </Button>
              </ButtonGroup>
            </Stack>
          )}

          {attackType === "spell"
            ? (
                <Stack sx={{ gap: 0.5 }}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={counterspellingEnabled}
                        onChange={(event) => setCounterspellingEnabled(event.target.checked)}
                      />
                    )}
                    label="Counterspelling"
                  />

                  {counterspellingEnabled && (
                    <Box sx={{ pl: 4 }}>
                      <RadioGroup
                        value={counterspellingSource}
                        onChange={(event) => setCounterspellingSource(event.target.value as CounterspellingSource)}
                      >
                        <FormControlLabel value="self" control={<Radio />} label={`From Yourself (${counterspellingRating})`} />
                        <FormControlLabel value="other" control={<Radio />} label="From Another" />
                      </RadioGroup>

                      {counterspellingSource === "other" && (
                        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                          <Typography variant="body2" sx={{ flex: 1 }}>Their Counterspelling rating</Typography>
                          <CounterInput
                            value={otherRating}
                            onChange={(value) => setOtherRating(value ?? 0)}
                            min={0}
                            max={20}
                            size="small"
                          />
                        </Stack>
                      )}
                    </Box>
                  )}
                </Stack>
              )
            : (
                <Stack sx={{ gap: 1.5 }}>
                  {groupedSkillOptions.map(({ group, options }) => (
                    <Stack key={group} sx={{ gap: 0.5 }}>
                      <Label label={group} />
                      <Stack sx={{ gap: 1 }}>
                        {options.map((option) => {
                          const isSelected = option.key === selectedOption.key
                          const rating = option.skill ? skillDataByKey[option.skill]?.rating ?? 0 : 0
                          const defaultable = option.skill ? (skillList[option.skill].defaultable ?? true) : false
                          const isDefaulted = rating === 0 && defaultable

                          return (
                            <Box
                              key={option.key}
                              sx={{
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: isSelected ? "secondary.main" : "divider",
                                backgroundColor: isSelected ? "action.selected" : undefined,
                              }}
                            >
                              <SkillListItem
                                name={option.label}
                                specialization={option.note}
                                rating={rating}
                                attr={baseAttr}
                                isDefaulted={isDefaulted}
                                onClick={() => setSelectedKey(option.key)}
                              />
                            </Box>
                          )
                        })}
                      </Stack>
                    </Stack>
                  ))}

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
        </Stack>
      )}

      {currentStep === "modifiers" && (
        <Stack sx={{ gap: 1 }}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={unaware}
                onChange={(event) => setUnaware(event.target.checked)}
                color="error"
              />
            )}
            label="You're unaware of the attack (no defense possible)"
          />

          {woundMod >= 1 && (
            <FormControlLabel
              control={<Checkbox checked disabled />}
              label={`Wounded (-${woundMod})`}
            />
          )}

          {modifiers.map((modifier) => {
            if (modifier.kind === "toggle") {
              return (
                <FormControlLabel
                  key={modifier.id}
                  disabled={unaware}
                  control={(
                    <Checkbox
                      checked={toggleValues[modifier.id] ?? false}
                      onChange={(event) =>
                        setToggleValues((prev) => ({ ...prev, [modifier.id]: event.target.checked }))}
                      disabled={unaware}
                    />
                  )}
                  label={`${modifier.label} (${modifier.value >= 0 ? "+" : ""}${modifier.value})`}
                />
              )
            }

            if (modifier.kind === "stepper") {
              const enabled = toggleValues[modifier.id] ?? false

              return (
                <Stack key={modifier.id} sx={{ gap: 0.5 }}>
                  <FormControlLabel
                    disabled={unaware}
                    control={(
                      <Checkbox
                        checked={enabled}
                        onChange={(event) => {
                          const checked = event.target.checked
                          setToggleValues((prev) => ({ ...prev, [modifier.id]: checked }))
                          if (checked && !stepperValues[modifier.id]) {
                            setStepperValues((prev) => ({ ...prev, [modifier.id]: modifier.min }))
                          }
                        }}
                        disabled={unaware}
                      />
                    )}
                    label={modifier.label}
                  />

                  {enabled && (
                    <Stack direction="row" sx={{ gap: 1, alignItems: "center", pl: 4 }}>
                      <Typography variant="body2" sx={{ flex: 1 }}># of Attacks</Typography>
                      <CounterInput
                        value={stepperValues[modifier.id] ?? modifier.min}
                        onChange={(value) => setStepperValues((prev) => ({ ...prev, [modifier.id]: value ?? modifier.min }))}
                        min={modifier.min}
                        max={modifier.max}
                        disabled={unaware}
                        size="small"
                      />
                    </Stack>
                  )}
                </Stack>
              )
            }

            const chosenKey = choiceValues[modifier.id] ?? modifier.options[0].key

            return (
              <FormControl key={modifier.id} disabled={unaware}>
                <Typography variant="body2" color="text.secondary">{modifier.label}</Typography>
                <RadioGroup
                  value={chosenKey}
                  onChange={(event) =>
                    setChoiceValues((prev) => ({ ...prev, [modifier.id]: event.target.value }))}
                >
                  {modifier.options.map((option) => (
                    <FormControlLabel
                      key={option.key}
                      value={option.key}
                      disabled={unaware}
                      control={<Radio disabled={unaware} />}
                      label={`${option.label}${option.value !== 0 ? ` (${option.value >= 0 ? "+" : ""}${option.value})` : ""}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )
          })}
        </Stack>
      )}

      {currentStep === "total" && (
        unaware
          ? <Alert severity="warning">No defense is possible — you're unaware of the attack.</Alert>
          : <DicePool name="Defense" groups={groups} />
      )}

      {currentStep === "resist" && (
        <Stack sx={{ gap: 1.5 }}>
          {attackType !== "spell" && (
            <Stack sx={{ gap: 0.5 }}>
              <Label label="Armor Type" />
              <ButtonGroup size="small" variant="outlined" fullWidth>
                <Button
                  variant={armorType === "ballistic" ? "contained" : "outlined"}
                  onClick={() => setArmorType("ballistic")}
                >
                  Ballistic
                </Button>
                <Button
                  variant={armorType === "impact" ? "contained" : "outlined"}
                  onClick={() => setArmorType("impact")}
                >
                  Impact
                </Button>
              </ButtonGroup>
            </Stack>
          )}

          <DicePool name="Resist Damage" groups={resistGroups} />

          <Divider />

          <Label label="Damage Taken" />
          <Grid container columns={2} spacing={1}>
            <Grid size={1}>
              <DamageTrack
                label="Physical"
                max={physicalTrack.max}
                current={physicalTrack.current}
                woundInterval={physicalTrack.woundInterval}
                allowOverflow
                onChange={(newValue) => dispatch(Actions.damage.setDamage({ track: DamageTrackKey.physical, value: newValue }))}
              />
            </Grid>

            <Grid size={1}>
              <DamageTrack
                label="Stun"
                max={stunTrack.max}
                current={stunTrack.current}
                woundInterval={stunTrack.woundInterval}
                onChange={(newValue) => dispatch(Actions.damage.setDamage({ track: DamageTrackKey.stun, value: newValue }))}
              />
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
