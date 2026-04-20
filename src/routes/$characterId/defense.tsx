import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
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
import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import { WoundModLabel } from "#/components/damage/woundModLabel.tsx"
import { EquippedArmorSection } from "#/components/gear/armor/equippedArmorSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const Route = createFileRoute("/$characterId/defense")({
  component: RouteComponent,
})

function RouteComponent() {
  const damageStore = useDamageStore()
  const physical = useStore(damageStore, (state) => state.physical)
  const stun = useStore(damageStore, (state) => state.stun)

  return (
    <Stack>
      <SectionHeader>Defense</SectionHeader>

      <Grid container columns={{ sm: 1, md: 2 }} spacing={1}>
        <Grid container columns={2} size={2} spacing={1} sx={{ width: { sm: "100%", md: "50%" }, margin: "auto" }}>
          <Grid size={1}>
            <DamageTrack
              label="Physical"
              max={physical.max}
              current={physical.current}
              woundInterval={physical.woundInterval}
              allowOverflow
              onChange={(newValue) => damageStore.setDamage(DamageTrackKey.physical, newValue)}
            />
          </Grid>

          <Grid size={1}>
            <DamageTrack
              label="Stun"
              max={stun.max}
              current={stun.current}
              woundInterval={stun.woundInterval}
              onChange={(newValue) => damageStore.setDamage(DamageTrackKey.stun, newValue)}
            />
          </Grid>

          <Grid size={2}>
            <WoundModLabel />
          </Grid>
        </Grid>

        <Grid size={2}>
          <EquippedArmorSection />
        </Grid>

        <Grid container columns={{ sm: 1, md: 3 }} size={2} spacing={1}>
          <Grid container columns={2} size={1}>
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

          <Grid container columns={2} size={1}>
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

          <Grid container columns={2} size={1}>
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

        <Grid container columns={{ sm: 1, md: 2 }} size={2} spacing={1}>
          <Grid container columns={2} size={1}>
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

          <Grid container columns={2} size={1}>
            <Grid size={2}>
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
        </Grid>
      </Grid>
    </Stack>
  )
}
