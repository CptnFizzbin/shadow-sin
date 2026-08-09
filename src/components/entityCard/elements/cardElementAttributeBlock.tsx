import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AttributeValueRow } from "#/components/runner/attributes/attributeValueRow.tsx"
import type { AttributeKey } from "#/system/attributeKey.ts"

export interface CardElementAttributeBlockProps {
  values: Record<AttributeKey, number>
  /** Rows of attribute keys, rendered in order — e.g. Physical, Mental, then a Special subset. */
  groups: readonly (readonly AttributeKey[])[]
}

/**
 * Stacked rows of an Entity's computed attribute values (e.g. a Spirit/Sprite's Force-derived
 * block) — thin wrapper around `AttributeValueRow`, one per `groups` entry, so callers only pick
 * which attribute groupings to show rather than reimplementing the row layout.
 */
export const CardElementAttributeBlock: FC<CardElementAttributeBlockProps> = ({ values, groups }) => (
  <Stack sx={{ gap: 0 }}>
    {groups.map((attrKeys, index) => <AttributeValueRow key={index} values={values} attrKeys={attrKeys} />)}
  </Stack>
)

CardElementAttributeBlock.displayName = "SpiritCard.AttributeBlock"
