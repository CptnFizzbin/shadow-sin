import { Divider } from "@mui/material"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

import { useCharacterStore, useCharacterStoreSlice } from "#/components/Character/CharacterStoreProvider.tsx"
import DamageTrack from "#/components/Damage/DamageTrack.tsx"
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
} from "#/components/Damage/ResistanceDicePools.tsx"
import { useWoundModifier } from "#/components/Damage/UseWoundModifier.ts"
import { Label } from "#/components/UI/Text/Label.tsx"
import { SkillKey } from "#/lib/system/SkillKey.ts"

export const Route = createFileRoute("/$characterId/defense")({
  component: RouteComponent,
})

function RouteComponent() {
  const damageSlice = useCharacterStoreSlice(
    (state) => state.damage,
    (state, damage) => {
      state.damage = damage
      return state
    },
  )
  const body = useCharacterStore((state) => state.attributes.body)
  const will = useCharacterStore((state) => state.attributes.willpower)
  const woundMod = useWoundModifier()

  const damageTracks = useCharacterStore((state) => state.damage)

  const maxPhysical = 8 + Math.ceil(body / 2)
  const maxStun = 8 + Math.ceil(will / 2)

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
            max={maxPhysical}
            current={damageTracks.physical}
            allowOverflow
            onChange={(value) => {
              damageSlice.update((draft) => {
                draft.physical = value
              })
            }}
          />
        </Grid>
        <Grid size={1}>
          <DamageTrack
            label="Stun"
            max={maxStun}
            current={damageTracks.stun}
            onChange={(value) => {
              damageSlice.update((draft) => {
                draft.stun = value
              })
            }}
          />
        </Grid>
        <Grid size={2}>
          <Label
            label={`Wound Mod: ${woundMod}`}
            variant="outlined"
            color={woundMod >= 1 ? "error.main" : "primary.dark"}
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
