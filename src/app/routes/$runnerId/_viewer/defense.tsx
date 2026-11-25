import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { DefenseCalculatorButton } from "#/app/components/entities/items/defenseCalculator/defenseCalculatorButton.tsx"
import { AvailableArmorSection } from "#/app/components/entities/items/types/armor/availableArmorSection.tsx"
import { AvailableGearFilter } from "#/app/components/entities/items/viewer/availableGearFilter.tsx"
import DamageTrack from "#/app/components/system/damage/damageTrack.tsx"
import {
  ManaSpellDefenseDicePool,
  MeleeBlockDicePool,
  MeleeDodgeDicePool,
  MeleeFullBlockDicePool,
  MeleeFullDodgeDicePool,
  MeleeFullParryDicePool,
  MeleeParryDicePool,
  PhysicalSpellDefenseDicePool,
  RangedDefenseDicePool,
  RangedFullDefenseDicePool,
  ResistDamageDicePool,
} from "#/app/components/system/damage/resistanceDicePools.tsx"
import { WoundModLabel } from "#/app/components/system/damage/woundModLabel.tsx"
import { DicePoolList } from "#/app/components/system/dicePool/dicePoolList.tsx"
import { DamageTrackKey } from "#/data/entities/damageTrackKey.ts"
import { ArmorRatingType } from "#/data/items/armorData.ts"
import { SkillKey } from "#/data/skills/skillKey.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { Label } from "#/ui/text/label.tsx"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/defense")({
  component: RouteComponent,
})

function RouteComponent() {
  const dispatch = useRunnerStoreDispatch()
  const physical = useRunnerSelector(DamageSelectors.track.physical)
  const stun = useRunnerSelector(DamageSelectors.track.stun)

  return (
    <Stack>
      <SectionHeader>Defense</SectionHeader>

      <DefenseCalculatorButton />

      <Stack>
        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <DamageTrack
            label="Physical"
            max={physical.max}
            current={physical.current}
            woundInterval={physical.woundInterval}
            allowOverflow
            onChange={(newValue) => dispatch(Actions.damage.setDamage({
              track: DamageTrackKey.physical,
              value: newValue,
            }))}
          />

          <DamageTrack
            label="Stun"
            max={stun.max}
            current={stun.current}
            woundInterval={stun.woundInterval}
            onChange={(newValue) => dispatch(Actions.damage.setDamage({ track: DamageTrackKey.stun, value: newValue }))}
          />
        </Stack>

        <WoundModLabel />
      </Stack>

      <Grid size={2}>
        <AvailableGearFilter>
          <AvailableArmorSection />
        </AvailableGearFilter>
      </Grid>

      <Grid container columns={{ sm: 1, md: 2 }} size={2} spacing={1}>
        <Grid size={2}>
          <Stack>
            <Label label="Ranged Defense" variant="outlined" />

            <DicePoolList>
              <RangedDefenseDicePool />
              <RangedFullDefenseDicePool />
            </DicePoolList>
          </Stack>
        </Grid>

        <Grid size={2}>
          <Stack>
            <Label label="Spell Defense" variant="outlined" />

            <DicePoolList>
              <PhysicalSpellDefenseDicePool />
              <ManaSpellDefenseDicePool />
            </DicePoolList>
          </Stack>
        </Grid>
      </Grid>

      <Grid size={2} spacing={1}>
        <Stack>
          <Label label="Melee Defense" variant="outlined" />

          <DicePoolList>
            <MeleeDodgeDicePool />
            <MeleeFullDodgeDicePool />
          </DicePoolList>

          <DicePoolList>
            <MeleeBlockDicePool />
            <MeleeFullBlockDicePool />
          </DicePoolList>
        </Stack>
      </Grid>

      <Grid size={2} spacing={1}>
        <Stack>
          <Label label="Melee Parry" variant="outlined" />

          {[
            { skill: SkillKey.blades },
            { skill: SkillKey.clubs },
            { skill: SkillKey.unarmedCombat },
          ].map(({ skill }) => (
            <DicePoolList key={skill}>
              <MeleeParryDicePool weaponSkill={skill} />
              <MeleeFullParryDicePool weaponSkill={skill} />
            </DicePoolList>
          ))}
        </Stack>
      </Grid>

      <Grid size={2}>
        <Stack>
          <Label label="Resist" variant="outlined" />

          <DicePoolList>
            <ResistDamageDicePool type="P" armor={ArmorRatingType.ballistic} />
            <ResistDamageDicePool type="P" armor={ArmorRatingType.impact} />
          </DicePoolList>

          <DicePoolList>
            <ResistDamageDicePool type="S" armor={ArmorRatingType.ballistic} />
            <ResistDamageDicePool type="S" armor={ArmorRatingType.impact} />
          </DicePoolList>
        </Stack>
      </Grid>
    </Stack>
  )
}
