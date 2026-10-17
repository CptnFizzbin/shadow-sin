import Checkbox from "@mui/material/Checkbox"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

import { StatChip } from "#/components/ui/chips/statChip.tsx"
import { mergeSx } from "#/integrations/mui/muiUtils.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

import { useLicenseCheck } from "./licenseCheckContext.tsx"
import { isRealCredential } from "./licenseCheckDice.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

interface LicenseCheckChecklistRowProps {
  item: ItemData
  check: VerificationCheck
  /** Replaces the include-in-scan checkbox, making the row non-toggleable (e.g. a SIN's active-SIN radio). */
  control?: ReactNode
}

function getRatingBadge(check: VerificationCheck): string | null {
  if (check.kind === "unlicensed-gear") return "Unlicensed"
  if (check.kind === "forbidden-gear") return "Forbidden"
  const credential = check.credentialRating
  if (credential === undefined) return null
  return isRealCredential(credential) ? "Real" : `Fake License | R${credential.rating ?? 0}`
}

export const LicenseCheckChecklistRow: FC<LicenseCheckChecklistRowProps> = ({ item, check, control }) => {
  const { items, addItem, removeItem } = useLicenseCheck()
  const ratingBadge = getRatingBadge(check)
  const isChecked = control !== undefined || items.some((checkedItem) => checkedItem.id === item.id)

  const handleRowClick = () => {
    if (control !== undefined) return
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
      {control ?? (
        <Checkbox
          size="small"
          checked={isChecked}
          slotProps={{ input: { "aria-label": `Include in scan: ${item.name}` } }}
        />
      )}

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
