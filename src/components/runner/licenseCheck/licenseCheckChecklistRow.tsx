import Checkbox from "@mui/material/Checkbox"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { StatChip } from "#/components/ui/statChip.tsx"
import { mergeSx } from "#/integrations/mui/muiUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useLicenseCheck } from "./licenseCheckContext.tsx"
import { isRealCredential } from "./licenseCheckDice.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

interface LicenseCheckChecklistRowProps {
  item: ItemData
  check: VerificationCheck
  /** SINs have no equip/carry state, so their row is never individually checked/unchecked. */
  showCheckbox?: boolean
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
  showCheckbox = true,
}) => {
  const { items, addItem, removeItem } = useLicenseCheck()
  const ratingBadge = getRatingBadge(check)
  const isChecked = items.some((checkedItem) => checkedItem.id === item.id)

  const handleRowClick = () => {
    if (!showCheckbox) return

    if (isChecked) {
      removeItem(item)
    } else {
      addItem(item)
    }
  }

  return (
    <Stack
      direction="row"
      sx={{ alignItems: "center", gap: 1 }}
      onClick={handleRowClick}
    >
      {showCheckbox && (
        <Checkbox
          size="small"
          checked={isChecked}
          slotProps={{ input: { "aria-label": `Include in scan: ${item.name}` } }}
        />
      )}

      <Stack
        direction="column"
        sx={mergeSx(
          { gap: 0.5 },
          showCheckbox && !isChecked && { opacity: 0.25 },
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
