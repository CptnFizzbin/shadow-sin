import Checkbox from "@mui/material/Checkbox"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { StatChip } from "#/components/ui/statChip.tsx"
import { useLicenseCheck } from "#/contexts/runner/licenseCheckContext.tsx"
import { mergeSx } from "#/integrations/mui/muiUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

import { isRealCredential } from "./licenseCheckDice.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

interface LicenseCheckChecklistRowProps {
  item: ItemData
  check: VerificationCheck
}

function getRatingBadge(check: VerificationCheck): string | null {
  if (check.kind === "unlicensed-gear") return "Unlicensed"
  if (check.kind === "forbidden-gear") return "Forbidden"
  const credential = check.credentialRating
  if (credential === undefined) return null
  return isRealCredential(credential) ? "Real" : `Fake License | R${credential.rating}`
}

export const LicenseCheckChecklistRow: FC<LicenseCheckChecklistRowProps> = ({ item, check }) => {
  const { items, addItem, removeItem } = useLicenseCheck()
  const ratingBadge = getRatingBadge(check)
  const isChecked = items.some((checkedItem) => checkedItem.id === item.id)

  const handleRowClick = () => {
    if (isChecked) {
      removeItem(item)
    } else {
      addItem(item)
    }
  }

  return (
    <Stack
      direction="row"
      sx={{ alignItems: "center" }}
      onClick={handleRowClick}
    >
      <Checkbox
        size="small"
        checked={isChecked}
        slotProps={{ input: { "aria-label": `Include in scan: ${item.name}` } }}
      />

      <Stack
        direction="column"
        sx={mergeSx({ gap: 0.5 }, !isChecked && { opacity: 0.25 })}
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
