import Checkbox from "@mui/material/Checkbox"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { StatChip } from "#/components/ui/statChip.tsx"
import { mergeSx } from "#/integrations/mui/muiUtils.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { ItemData } from "#/system/itemData.ts"

import { isRealCredential } from "./licenseCheckDice.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

interface LicenseCheckChecklistRowProps {
  item: ItemData
  check: VerificationCheck
  /** SINs have no equip/carry state, so their row is not stash-eligible. */
  showStashToggle?: boolean
}

function getRatingBadge(check: VerificationCheck): string | null {
  if (check.kind === "unlicensed-gear") return "Unlicensed"
  if (check.kind === "forbidden-gear") return "Forbidden"
  if (check.credentialRating === undefined) return null
  return isRealCredential(check.credentialRating) ? "Real" : `Fake License | R${check.credentialRating}`
}

export const LicenseCheckChecklistRow: FC<LicenseCheckChecklistRowProps> = ({
  item,
  check,
  showStashToggle = true,
}) => {
  const dispatch = useRunnerStoreDispatch()
  const ratingBadge = getRatingBadge(check)

  const [isStashed, setIsStashed] = useState(false)

  const handleRowClick = () => {
    if (!showStashToggle) return

    setIsStashed(!isStashed)

    if (isStashed) {
      dispatch(Actions.gear.unstashItem({ id: item.id }))
    } else {
      dispatch(Actions.gear.stashItem({ id: item.id }))
    }
  }

  return (
    <Stack
      direction="row"
      sx={{ alignItems: "center", gap: 1 }}
      onClick={handleRowClick}
    >
      {showStashToggle && (
        <Checkbox
          size="small"
          aria-label={`Stashed: ${item.name}`}
          checked={!isStashed}
        />
      )}

      <Stack
        direction="column"
        sx={mergeSx(
          { gap: 0.5 },
          isStashed && { opacity: 0.25 },
        )}
      >
        <Stack direction="row">
          <Typography variant="body2" noWrap>{item.name}</Typography>
        </Stack>
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          {ratingBadge && <StatChip label={ratingBadge} />}
        </Stack>
      </Stack>
    </Stack>
  )
}
