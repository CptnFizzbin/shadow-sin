import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiStarLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"
import type { FC, ReactNode } from "react"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityData } from "#/system/entityData.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

export const Route = createFileRoute("/test/entity-card/base-entity-card")({
  component: EntityCardTestPage,
})

interface SectionProps {
  title: string
  children: ReactNode
}

const Section: FC<SectionProps> = ({ title, children }) => (
  <Stack>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    <Divider />
    <Stack sx={{ alignItems: "flex-start" }}>{children}</Stack>
  </Stack>
)

/** Every common `EntityData` field populated, so `EntityCard` renders every one of its own elements. */
const TEST_ENTITY: EntityData = {
  kind: EntityKind.item,
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
            <EntityCard entity={{ kind: EntityKind.item, id: crypto.randomUUID(), name: "Minimal Entity" }} />
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Rating override (e.g. a Real SIN, which carries no plain rating)">
            <EntityCard
              entity={{ kind: EntityKind.item, id: crypto.randomUUID(), name: "Real SIN" }}
              ratingOverride="Real"
            />
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Extra Layout rows with Stat/Action elements (category-tier composition)">
            <EntityCard entity={TEST_ENTITY}>
              <EntityCard.Action label="Roll Attack" onClick={() => alert("Roll Attack")} />

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
            </EntityCard>
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="leftAction plus Edit/Remove actions menu">
            <EntityCard
              entity={TEST_ENTITY}
              onOpen={() => alert("Open")}
              onEdit={() => alert("Edit")}
              onRemove={() => alert("Remove")}
              leftAction={{ icon: <RiStarLine size={20} />, onClick: () => alert("Left action") }}
            />
          </Section>
        </Stack>
      </Paper>

      <Paper>
        <Stack sx={{ gap: 2, padding: 2 }}>
          <Section title="Long name — wrapping check">
            <EntityCard
              entity={{
                kind: EntityKind.item,
                id: crypto.randomUUID(),
                name: "A Very Long Entity Name That Should Wrap Or Truncate Gracefully In The Header Row",
                rating: 12,
              }}
            />
          </Section>
        </Stack>
      </Paper>
    </Stack>
  )
}
