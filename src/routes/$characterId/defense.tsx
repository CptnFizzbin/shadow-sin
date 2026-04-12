import { Divider } from "@mui/material"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"
import { Fragment } from "react"

import DamageTrack from "#/components/damage/damageTrack.tsx"
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
  ResistBodyDicePool,
  ResistWillpowerDicePool,
} from "#/components/damage/resistanceDicePools.tsx"
import { useDamageState } from "#/components/damage/useDamageState.ts"
import { WoundModLabel } from "#/components/damage/woundModLabel.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"

export const Route = createFileRoute("/$characterId/defense")({
  component: RouteComponent,
})

function RouteComponent() {
  const damageStore = useDamageState()

  return (
    <Stack gap={1}>
      {/* TODO: Tabs for meatspace, astrial, and matrix */}

      <Grid container columns={2} spacing={1}>
        <Grid size={1}>
          <DamageTrack
            label="Physical"
            max={damageStore.physical.max}
            current={damageStore.physical.current}
            allowOverflow
            onChange={(newValue) => damageStore.physical.setValue(() => newValue)}
          />
        </Grid>

        <Grid size={1}>
          <DamageTrack
            label="Stun"
            max={damageStore.stun.max}
            current={damageStore.stun.current}
            onChange={(newValue) => damageStore.stun.setValue(() => newValue)}
          />
        </Grid>

        <Grid size={2}>
          <WoundModLabel />
        </Grid>

        <Grid size={2}>
          <Divider flexItem color="secondary.main" />
        </Grid>

        <Grid container size={2}>
          <Grid size={2}>
            <Label label="Resist" variant="outlined" />
          </Grid>

          <Grid size={1}>
            <ResistBodyDicePool />
          </Grid>

          <Grid size={1}>
            <ResistWillpowerDicePool />
          </Grid>
        </Grid>

        <Grid size={2}>
          <Divider flexItem color="secondary.main" />
        </Grid>

        <Grid container size={2}>
          <Grid size={2}>
            <Label label="Ranged Defense" variant="outlined" />
          </Grid>

          <Grid size={1}>
            <RangedDefenseDicePool />
          </Grid>

          <Grid size={1}>
            <RangedFullDefenseDicePool />
          </Grid>
        </Grid>

        <Grid container size={2}>
          <Grid size={3}>
            <Label label="Melee Defense" variant="outlined" />
          </Grid>

          <Grid size={1}>
            <MeleeBlockDicePool />
          </Grid>

          <Grid size={1}>
            <MeleeFullDodgeDicePool />
          </Grid>

          <Grid size={1}>
            <MeleeDodgeDicePool />
          </Grid>

          <Grid size={1}>
            <MeleeFullBlockDicePool />
          </Grid>
        </Grid>

        <Grid container size={2}>
          <Grid size={3}>
            <Label label="Melee Parry" variant="outlined" />
          </Grid>

          {[
            { skill: SkillKey.blades },
            { skill: SkillKey.clubs },
            { skill: SkillKey.unarmedCombat },
          ].map(({ skill }) => (
            <Fragment key={skill}>
              <Grid size={1}>
                <MeleeParryDicePool weaponSkill={skill} />
              </Grid>

              <Grid size={1}>
                <MeleeFullParryDicePool weaponSkill={skill} />
              </Grid>
            </Fragment>
          ))}
        </Grid>

        <Grid container size={2}>
          <Grid size={2}>
            <Label label="Spell Defense" variant="outlined" />
          </Grid>

          <Grid size={1}>
            <PhysicalSpellDefenseDicePool />
          </Grid>

          <Grid size={1}>
            <ManaSpellDefenseDicePool />
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}
