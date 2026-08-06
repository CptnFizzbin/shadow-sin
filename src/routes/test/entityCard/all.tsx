import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import type { FC, ReactNode } from "react"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityData } from "#/system/entityData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const Route = createFileRoute("/test/entityCard/all")({
  component: EntityCardTestPage,
})

interface SectionProps {
  title: string
  children: ReactNode
}

const Section: FC<SectionProps> = ({ title, children }) => (
  <Stack sx={{ gap: 1 }}>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    <Divider />
    <Stack sx={{ alignItems: "flex-start" }}>{children}</Stack>
  </Stack>
)

/** Every common `EntityData` field populated, so `EntityCard` renders every one of its own elements. */
const TEST_ENTITY: EntityData = {
  id: crypto.randomUUID(),
  name: "Test Entity — All Elements",
  description: "A synthetic entity with every common field populated, for visual QA.",
  rating: 6,
  source: { book: "SR4A", page: 427 },
  effects: [
    { type: GameEffectType.attrMod, target: AttributeKey.body, value: 2 },
    { type: GameEffectType.dicePoolMod, target: "Perception", value: 1 },
  ],
}

/**
 * Renders `EntityCard` with every common `EntityData` field populated (auto Title/Rating/
 * Effects/Source) plus every `Layout` region and content element supplied as extra children at
 * once — a single page to visually check the whole foundation without hunting through real
 * runner data for an entity that happens to use every element.
 */
function EntityCardTestPage() {
  return (
    <Stack sx={{ gap: 3, padding: 2 }}>
      <Typography variant="h2">EntityCard Test Page</Typography>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Every common field, auto-rendered">
            <EntityCard entity={TEST_ENTITY} />
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Minimal — name only, no rating/effects/source">
            <EntityCard entity={{ id: crypto.randomUUID(), name: "Minimal Entity" }} />
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Sentinel rating (e.g. a Real SIN)">
            <EntityCard entity={{ id: crypto.randomUUID(), name: "Real SIN", rating: "real" }} />
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Extra Layout rows with Stat/Action elements (category-tier composition)">
            <EntityCard entity={TEST_ENTITY}>
              <EntityCard.Layout.HeaderRow>
                <EntityCard.Stat label="Type" value="Weapon" />
              </EntityCard.Layout.HeaderRow>

              <EntityCard.Layout.BodyRow>
                <EntityCard.Stat label="DV" value="8P" type="damage" />
                <EntityCard.Stat label="Modifier" value="+2" type="modifier" />
                <EntityCard.Stat label="Warning" value="Illegal" type="warning" />
                <EntityCard.Stat label="Forbidden" value="Banned" type="forbidden" />
                <EntityCard.Stat label="Plain" value="No color" />
              </EntityCard.Layout.BodyRow>

              <EntityCard.Layout.FooterRow>
                <EntityCard.Action label="Roll Attack" onClick={() => alert("Roll Attack")} />
              </EntityCard.Layout.FooterRow>
            </EntityCard>
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Long name and many effects — wrapping check">
            <EntityCard
              entity={{
                id: crypto.randomUUID(),
                name: "A Very Long Entity Name That Should Wrap Or Truncate Gracefully In The Header Row",
                rating: 12,
                effects: [
                  { type: GameEffectType.attrMod, target: AttributeKey.body, value: 2 },
                  { type: GameEffectType.attrMod, target: AttributeKey.agility, value: -1 },
                  { type: GameEffectType.skillMod, target: SkillKey.automatics, value: 3 },
                  { type: GameEffectType.initiativeBonus, value: 1 },
                  { type: GameEffectType.recoilReduction, value: 2 },
                ],
              }}
            />
          </Section>
        </Stack>
      </Paper>
    </Stack>
  )
}
