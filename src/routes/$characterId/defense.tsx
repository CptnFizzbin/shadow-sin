import { Divider } from "@mui/material"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

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
import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { SkillKey } from "#/lib/system/skillKey.ts"

export const Route = createFileRoute("/$characterId/defense")({
  component: RouteComponent,
})

function RouteComponent() {
  const damageStore = useDamageStore()

  return (
    <Stack gap={1}>
      <Paper>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Defense
        </Typography>
      </Paper>

      {/* TODO: Tabs for meatspace, astrial, and matrix */}

      <Grid container columns={2} spacing={1}>
        <Grid size={1}>
          <DamageTrack
            label="Physical"
            max={damageStore.physical.max}
            current={damageStore.physical.current}
            allowOverflow
            onChange={damageStore.physical.setValue}
          />
        </Grid>

        <Grid size={1}>
          <DamageTrack
            label="Stun"
            max={damageStore.stun.max}
            current={damageStore.stun.current}
            onChange={damageStore.stun.setValue}
          />
        </Grid>

        <Grid size={2}>
          <Label
            label={`Wound Mod: ${damageStore.woundMod}`}
            variant="outlined"
            color={damageStore.woundMod >= 1 ? "error.main" : "primary.dark"}
          />
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
            <>
              <Grid size={1}>
                <MeleeParryDicePool weaponSkill={skill} />
              </Grid>

              <Grid size={1}>
                <MeleeFullParryDicePool weaponSkill={skill} />
              </Grid>
            </>
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
