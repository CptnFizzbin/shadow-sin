import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { StatChip } from "#/components/ui/statChip.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ItemData } from "#/system/itemData.ts"
import { isStashed } from "#/system/items/itemUtils.ts"

import { isRealCredential } from "./licenseCheckDice.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

interface LicenseCheckChecklistRowProps {
  item: ItemData
  check: VerificationCheck
  /** SINs have no equip/carry state, so their row is not stash-eligible. */
  showStashToggle?: boolean
  /** Licensed gear nested under its covering SIN — shown with a connector glyph. */
  nested?: boolean
}

const tagByKind: Partial<Record<VerificationCheck["kind"], { label: string, color: "warning" | "error" }>> = {
  "unlicensed-gear": { label: "W", color: "warning" },
  "forbidden-gear": { label: "E", color: "error" },
}

function getRatingBadge(check: VerificationCheck): string | null {
  if (check.kind === "unlicensed-gear") return "Unlicensed"
  if (check.kind === "forbidden-gear") return "Forbidden"
  if (check.credentialRating === undefined) return null
  return isRealCredential(check.credentialRating) ? "Real" : `Rating ${check.credentialRating}`
}

export const LicenseCheckChecklistRow: FC<LicenseCheckChecklistRowProps> = ({
  item,
  check,
  showStashToggle = true,
  nested = false,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const tag = tagByKind[check.kind]
  const ratingBadge = getRatingBadge(check)

  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
      {showStashToggle
        ? (
            <Checkbox
              size="small"
              aria-label={`Stashed: ${item.name}`}
              checked={isStashed(item)}
              onChange={() => {
                // TODO(#388): stub dispatch only — does not persist a stashed state anywhere.
                // Item-stashing (docs/features/0012-item-stashing.md) will add a real
                // `_state.stashed` field; until then this dispatches `setItem` with the item
                // unchanged so the wiring exists but nothing is actually saved. `checked` stays
                // `isStashed(item)` (always false), so this checkbox will visually appear not to
                // respond — that's intentional per the ticket.
                dispatch(Actions.gear.setItem({ ...item }))
              }}
            />
          )
        : (
            <Box sx={{ width: 42, flexShrink: 0 }} />
          )}

      {nested && (
        <Typography component="span" color="text.disabled" sx={{ flexShrink: 0 }}>
          ↳
        </Typography>
      )}

      <Stack direction="row" sx={{ alignItems: "center", gap: 1, minWidth: 0, flexGrow: 1 }}>
        {tag && (
          <Typography component="span" variant="caption" color={`${tag.color}.main`} sx={{ fontWeight: "bold" }}>
            [
            {tag.label}
            ]
          </Typography>
        )}
        <Typography variant="body2" noWrap>{item.name}</Typography>
        {item.availability && <AvailabilityChip availability={item.availability} />}
        {ratingBadge && <StatChip label={ratingBadge} />}
      </Stack>
    </Stack>
  )
}
