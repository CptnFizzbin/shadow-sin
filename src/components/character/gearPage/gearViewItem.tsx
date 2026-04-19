import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AvailabilityChip } from "#/components/gear/availabilityChip.tsx"
import { getImplantEffectiveEssenceCost, getImplantEffectiveNuyenCost } from "#/components/gear/implantUtils.ts"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { isArmorData } from "#/lib/system/gear/armorData.ts"
import { ImplantGrade, ImplantType, isImplant } from "#/lib/system/gear/implantData.ts"
import { isLicenseData } from "#/lib/system/gear/licenseData.ts"
import { isSinData } from "#/lib/system/gear/sinData.ts"
import { isWeaponData } from "#/lib/system/gear/weaponData.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

interface SubItemCallbacks {
  onEdit?: () => void
  onRemove?: () => void
}

interface GearViewItemProps {
  item: ItemData
  subItems?: ItemData[]
  onEdit?: () => void
  onRemove?: () => void
  getSubItemCallbacks?: (subItemId: string) => SubItemCallbacks
}

const gradeLabel: Partial<Record<string, string>> = {
  [ImplantGrade.standard]: "Std",
  [ImplantGrade.alpha]: "Alpha",
  [ImplantGrade.beta]: "Beta",
  [ImplantGrade.delta]: "Delta",
}

const implantTypeLabel: Partial<Record<string, string>> = {
  [ImplantType.cyberware]: "Cyber",
  [ImplantType.bioware]: "Bio",
}

export const GearViewItem: FC<GearViewItemProps> = ({
  item,
  subItems = [],
  onEdit,
  onRemove,
  getSubItemCallbacks,
}) => {
  const { availability, source, description } = item

  const displayCost = isImplant(item)
    ? getImplantEffectiveNuyenCost(item)
    : (item.cost ?? 0)

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack
        direction="column"
        sx={{
          "padding": 1,
          "borderRadius": 1,
          "border": "1px solid",
          "borderColor": "divider",
          ...(onEdit && {
            "cursor": "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }),
        }}
        onClick={onEdit}
      >
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
            {item.name}
          </Typography>

          {(item.quantity ?? 1) > 1 && (
            <Chip
              label={`×${item.quantity}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {item.equipped && (
            <Chip
              label="Equipped"
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {item.wireless?.enabled && (
            <Chip
              label="Wireless"
              size="small"
              color="info"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          <Typography>
            <Nuyen amount={displayCost} />
          </Typography>

          {onRemove && (
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
            >
              <RiDeleteBin6Line size={16} />
            </IconButton>
          )}
        </Stack>

        <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", pt: 1 }}>
          {isWeaponData(item) && item.dmg && (
            <Chip
              label={`DV: ${item.dmg}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {isWeaponData(item) && item.ap !== undefined && item.ap !== 0 && (
            <Chip
              label={`AP: ${item.ap}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {isArmorData(item) && (
            <>
              <Chip
                label={`B: ${item.ballistic}`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
              <Chip
                label={`I: ${item.impact}`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            </>
          )}

          {isImplant(item) && (
            <>
              {item.implantType && (
                <Chip
                  label={implantTypeLabel[item.implantType] ?? item.implantType}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
              {item.grade && item.grade !== ImplantGrade.standard && (
                <Chip
                  label={gradeLabel[item.grade] ?? item.grade}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
              <Chip
                label={`${getImplantEffectiveEssenceCost(item).toFixed(2).replace(/\.?0+$/, "")} Ess`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            </>
          )}

          {isSinData(item) && (
            <Chip
              label={item.rating === "real" ? "Real SIN" : `Rating: ${item.rating}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {isLicenseData(item) && (
            <Chip
              label={`Rating: ${item.rating}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {availability && (
            <AvailabilityChip availability={availability} />
          )}

          {source && (
            <Chip
              label={`${source.book} p.${source.page}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}

          {description && (
            <Typography

              color="text.secondary"
              sx={{ flexGrow: 1, alignSelf: "center" }}
            >
              {description}
            </Typography>
          )}
        </Stack>
      </Stack>

      {subItems.length > 0 && (
        <Stack
          sx={{ gap: 1, paddingLeft: 1,
            paddingBottom: 1,
            borderLeft: "4px solid",
            borderBottom: "1px solid",
            borderColor: "divider" }}
        >
          {subItems.map((subItem) => (
            <GearViewItem key={subItem.id} item={subItem} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
