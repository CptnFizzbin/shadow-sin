import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import {
  RiAddLine,
  RiArrowLeftLine,
  RiCornerUpLeftLine,
  RiDeleteBinLine,
  RiDragMove2Line,
  RiEditLine,
  RiMenuLine,
} from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { AvailabilityChip } from "#/components/items/availability/availabilityChip.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { InlineDamageTrack } from "#/components/system/damage/inlineDamageTrack.tsx"
import { getEffectLabel } from "#/components/system/gameEffects/gameEffectsSummary.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import { Icons } from "#/lib/icons.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { isEquipped, isStashed } from "#/system/items/itemUtils.ts"
import { formatBookRef } from "#/system/sourceData.ts"

import { useVehicleFormDialog } from "./dialogs/vehicleFormDialog.tsx"

export interface VehicleItemDetailsProps {
  vehicle: VehicleData
  onRemoved?: () => void
  /** Renders its own back control (desktop button, mobile back/menu bar) instead of the route's. */
  onBack?: () => void
  /** Called with an attached mod when its subitem card is tapped, to navigate to its own details page. */
  onOpenAttachment?: (item: ItemData) => void
}

/**
 * "Neon Manifest" layout from the item-details catalogue (docs/adr/0009).
 * Fixed order: parent-item breadcrumb (only when this vehicle is itself an
 * attachment) → header (name/qty, menu/move/edit, subtype-status |
 * availability-cost) → HUD-styled dashboard tiles for stats → condition
 * monitor(s) as a list (only one exists on real vehicle data today, but a
 * second — e.g. Matrix, on a rigged drone — is just another list entry once
 * the data model carries one) → Description | Notes → Effects → Attached
 * mods. Diverges from the other eight item types (still `ItemDetailsRoot`
 * + `ItemDetailsSlot.*`, ADR-0009's "Field Report" stack) — vehicles are the
 * one type with enough numbers to want a dashboard. "Move" and "Add Item"
 * have no real feature behind them yet, so those buttons are present but
 * disabled.
 */
export const VehicleItemDetails: FC<VehicleItemDetailsProps> = ({ vehicle, onRemoved, onBack, onOpenAttachment }) => {
  const dispatch = useRunnerStoreDispatch()
  const vehicleFormDialog = useVehicleFormDialog()
  const mods = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(vehicle.id))
  const parent = useRunnerStoreSelector(Selectors.gear.selectById(vehicle.parentId as UUID))
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const closeMenu = () => setMenuAnchor(null)

  const damageMax = vehicle.damage?.physical.max || vehicle.body
  const effects = vehicle.effects ?? []

  const removeVehicle = () => {
    dispatch(Actions.gear.removeItem({ id: vehicle.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleDamageChange = (current: number) => {
    const updated: VehicleData = { ...vehicle, damage: { physical: { current, max: damageMax } } }
    dispatch(Actions.gear.setItem(updated))
  }

  const handleEdit = async () => {
    const saved = await vehicleFormDialog.open({ vehicle })
    if (saved) dispatch(isNewItem(saved) ? Actions.gear.addItem(saved) : Actions.gear.setItem(saved))
  }

  // Real data only carries one condition monitor today; rendering this as a
  // list means a second track (e.g. Matrix, for a rigged drone) is just
  // another entry once the data model supports one.
  const damageTracks = [
    { label: "Physical", max: damageMax, current: vehicle.damage?.physical.current ?? 0, onChange: handleDamageChange },
  ]

  const dashTiles: { k: string, v: string | number }[] = [
    { k: "Handling", v: vehicle.handling },
    { k: "Accel", v: vehicle.accel },
    { k: "Speed", v: vehicle.speed },
    { k: "Sensor", v: vehicle.sensor },
    { k: "Armor", v: vehicle.armor },
    { k: "Body", v: vehicle.body },
  ]

  return (
    <>
      <Stack sx={{ gap: 2 }}>
        <Stack
          direction="row"
          sx={{ display: { xs: "flex", md: "none" }, borderBottom: "1px solid", borderColor: "divider", mx: -2, mb: 1 }}
        >
          <Box
            role="button"
            tabIndex={0}
            onClick={onBack}
            sx={{
              flex: "0 0 30%", display: "flex", alignItems: "center", gap: 0.5, p: 1,
              borderRight: "1px solid", borderColor: "divider", cursor: "pointer",
            }}
          >
            <RiArrowLeftLine size={16} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>Back</Typography>
          </Box>
          <Box
            role="button"
            tabIndex={0}
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            sx={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5, p: 1,
              color: "primary.main", cursor: "pointer",
            }}
          >
            <RiMenuLine size={16} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>Menu</Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onBack}
          aria-label="Back"
          sx={{ display: { xs: "none", md: "inline-flex" }, alignSelf: "flex-start" }}
        >
          <RiArrowLeftLine size={20} />
        </IconButton>

        <Stack sx={{ gap: 0.5 }}>
          {parent && (
            <Box
              component="button"
              type="button"
              onClick={onOpenAttachment ? () => onOpenAttachment(parent) : undefined}
              sx={{
                display: "inline-flex", alignItems: "center", gap: 0.5, alignSelf: "flex-start",
                border: "none", bgcolor: "transparent", p: 0, font: "inherit",
                fontSize: "0.75rem", color: "text.secondary",
                ...(onOpenAttachment && { "cursor": "pointer", "&:hover": { color: "primary.main" } }),
              }}
            >
              <RiCornerUpLeftLine size={12} /> {parent.name}
            </Box>
          )}

          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
            <Stack direction="row" sx={{ gap: 0.75, alignItems: "baseline" }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{vehicle.name}</Typography>
              {vehicle.quantity !== undefined && (
                <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>×{vehicle.quantity}</Typography>
              )}
            </Stack>

            <Stack direction="row" sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flexShrink: 0 }}>
              <IconButton size="small" onClick={(event) => setMenuAnchor(event.currentTarget)} aria-label="More actions">
                <RiMenuLine size={16} />
              </IconButton>
              <Tooltip title="Not implemented yet">
                <span>
                  <IconButton size="small" disabled aria-label="Move (not implemented yet)">
                    <RiDragMove2Line size={16} />
                  </IconButton>
                </span>
              </Tooltip>
              <IconButton size="small" onClick={handleEdit} sx={{ color: "primary.main" }} aria-label="Edit">
                <RiEditLine size={16} />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>{vehicle.vehicleType}</Typography>
              {isEquipped(vehicle) && (
                <ItemDetailsSlot.Status icon={Icons.item.equipped} label="Equipped" />
              )}
              {isStashed(vehicle) && (
                <ItemDetailsSlot.Status icon={Icons.item.stashed} label="Stashed" />
              )}
              {vehicle.wireless?.enabled === false && (
                <ItemDetailsSlot.Status icon={Icons.item.wireless.disabled} label="Wireless Off" />
              )}
            </Stack>

            <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              {vehicle.availability && <AvailabilityChip availability={vehicle.availability} />}
              {vehicle.cost !== undefined && (
                <Typography sx={{ fontSize: "0.8rem" }}>{formatNuyen(vehicle.cost)}</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(6, 1fr)" },
            gap: 1,
          }}
        >
          {dashTiles.map((tile) => (
            <Box key={tile.k} sx={{ borderTop: "2px solid", borderColor: "secondary.main", bgcolor: "background.paper", p: 1 }}>
              <Typography sx={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {tile.k}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, fontSize: "1.1rem", color: "secondary.main", fontVariantNumeric: "tabular-nums" }}
              >
                {tile.v}
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack sx={{ gap: 1.5 }}>
          {damageTracks.map((track) => (
            <InlineDamageTrack
              key={track.label}
              label={track.label}
              max={track.max}
              current={track.current}
              onChange={track.onChange}
            />
          ))}
        </Stack>

        {(vehicle.description || vehicle.notes) && (
          <Stack direction={{ xs: "column", md: "row" }} sx={{ gap: 2 }}>
            {vehicle.description && (
              <Stack sx={{ gap: 0.5, flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Description</Typography>
                <Typography sx={{ color: "text.secondary" }}>{vehicle.description}</Typography>
              </Stack>
            )}

            {vehicle.notes && (
              <Stack
                sx={{
                  gap: 0.5,
                  flex: 1,
                  minWidth: 0,
                  borderLeft: { md: "1px solid" },
                  borderColor: { md: "divider" },
                  pl: { md: 2 },
                  borderTop: { xs: "1px solid", md: "none" },
                  borderTopColor: { xs: "divider" },
                  pt: { xs: 1, md: 0 },
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Notes</Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>{vehicle.notes}</Typography>
              </Stack>
            )}
          </Stack>
        )}

        {effects.length > 0 && (
          <Stack sx={{ gap: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Effects</Typography>
            <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
              {effects.map((effect, index) => (
                <Chip
                  key={`${effect.type}-${effect.target ?? "none"}-${index}`}
                  size="small"
                  variant="outlined"
                  label={getEffectLabel(effect)}
                  sx={{ "height": "auto", "& .MuiChip-label": { whiteSpace: "normal" } }}
                />
              ))}
            </Stack>
          </Stack>
        )}

        <Stack sx={{ gap: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Attached</Typography>

          {Object.values(mods).length > 0 && (
            <Stack sx={{ gap: 1 }}>
              {Object.values(mods).map((mod) => (
                <ItemDetailsSlot.Subitem
                  key={mod.id}
                  item={mod}
                  onOpen={onOpenAttachment ? () => onOpenAttachment(mod) : undefined}
                />
              ))}
            </Stack>
          )}

          <Tooltip title="Not implemented yet">
            <span>
              <Box
                component="button"
                type="button"
                disabled
                aria-label="Add Item (not implemented yet)"
                sx={{
                  "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": 0.5,
                  "border": "1px dashed", "borderColor": "divider", "color": "text.secondary",
                  "bgcolor": "transparent", "font": "inherit", "fontSize": "0.75rem", "fontWeight": 700,
                  "textTransform": "uppercase", "letterSpacing": "0.04em", "py": 0.75, "cursor": "default",
                  "&:disabled": { opacity: 0.6 },
                }}
              >
                <RiAddLine size={14} /> Add Item
              </Box>
            </span>
          </Tooltip>
        </Stack>

        {vehicle.source && (
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{formatBookRef(vehicle.source)}</Typography>
        )}

        <Stack
          direction="row"
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            gap: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            mx: -2,
            mt: 1,
            py: 1,
            bgcolor: "background.paper",
          }}
        >
          <Tooltip title="Not implemented yet">
            <span>
              <IconButton disabled aria-label="Move (not implemented yet)">
                <RiDragMove2Line size={18} />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton onClick={handleEdit} sx={{ color: "primary.main" }} aria-label="Edit">
            <RiEditLine size={18} />
          </IconButton>
        </Stack>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
          <MenuItem
            onClick={() => {
              handleEdit()
              closeMenu()
            }}
          >
            <RiEditLine size={16} style={{ marginRight: 8 }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              removeVehicle()
              closeMenu()
            }}
          >
            <RiDeleteBinLine size={16} style={{ marginRight: 8 }} /> Remove
          </MenuItem>
        </Menu>
      </Stack>

      {vehicleFormDialog.dialog}
    </>
  )
}
