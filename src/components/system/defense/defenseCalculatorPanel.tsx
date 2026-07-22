import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { useActiveSkillRating } from "#/components/runner/runnerUtils.ts"
import { SkillListItem } from "#/components/runner/skills/skillListItem.tsx"
import { WoundModLabel } from "#/components/system/damage/woundModLabel.tsx"
import type { DiceGroup, DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import {
  useActiveSkillDiceGroup,
  useDefaultingDiceGroup,
  useEncumbranceDiceGroup,
  useWoundDiceGroup,
} from "#/components/system/dicePool/useDiceGroup.ts"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { AttributeKey, AttributeLabels } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import type { DefenseAttackType } from "./defenseCalculatorData.ts"
import { defenseModifiersForAttackType, defenseSkillOptionsByAttackType } from "./defenseCalculatorData.ts"

interface DefenseCalculatorPanelProps {
  attackType: DefenseAttackType
}

type SpellAttribute = "physical" | "mana"
type WizardStep = "skill" | "modifiers" | "total"

const wizardSteps: { step: WizardStep, label: string }[] = [
  { step: "skill", label: "Defense Skill" },
  { step: "modifiers", label: "Modifiers" },
  { step: "total", label: "Total" },
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
  const [unaware, setUnaware] = useState(false)
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({})
  const [stepperValues, setStepperValues] = useState<Record<string, number>>({})
  const [choiceValues, setChoiceValues] = useState<Record<string, string>>({})

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

  const woundGroup = useWoundDiceGroup()
  const encumbranceGroup = useEncumbranceDiceGroup()

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
      const count = stepperValues[modifier.id] ?? 0
      if (count === 0) return null
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
    selectedSkillEntry?.diceGroup ?? null,
    selectedSkillEntry?.defaultingGroup ?? null,
    woundGroup,
    attackType !== "spell" ? encumbranceGroup : null,
    ...modifierGroups,
  ]

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

          <Stack sx={{ gap: 1 }}>
            {visibleSkillOptions.map((option) => {
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
                    rating={rating}
                    attr={baseAttr}
                    isDefaulted={isDefaulted}
                    onClick={() => setSelectedKey(option.key)}
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

          <WoundModLabel />

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
              return (
                <Stack key={modifier.id} direction="row" sx={{ gap: 1, alignItems: "center" }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>{modifier.label}</Typography>
                  <CounterInput
                    value={stepperValues[modifier.id] ?? 0}
                    onChange={(value) => setStepperValues((prev) => ({ ...prev, [modifier.id]: value ?? 0 }))}
                    min={modifier.min}
                    max={modifier.max}
                    disabled={unaware}
                    size="small"
                  />
                </Stack>
              )
            }

            const chosenKey = choiceValues[modifier.id] ?? modifier.options[0].key

            return (
              <Stack key={modifier.id} sx={{ gap: 0 }}>
                <Typography variant="body2" color="text.secondary">{modifier.label}</Typography>
                {modifier.options.slice(1).map((option) => (
                  <FormControlLabel
                    key={option.key}
                    disabled={unaware}
                    control={(
                      <Checkbox
                        checked={chosenKey === option.key}
                        onChange={(event) => setChoiceValues((prev) => ({
                          ...prev,
                          [modifier.id]: event.target.checked ? option.key : modifier.options[0].key,
                        }))}
                        disabled={unaware}
                      />
                    )}
                    label={`${option.label} (${option.value >= 0 ? "+" : ""}${option.value})`}
                  />
                ))}
              </Stack>
            )
          })}
        </Stack>
      )}

      {currentStep === "total" && (
        unaware
          ? <Alert severity="warning">No defense is possible — you're unaware of the attack.</Alert>
          : <DicePool name="Defense" groups={groups} />
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
