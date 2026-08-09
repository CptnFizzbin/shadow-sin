import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { RiArrowLeftLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { WeaponAttackHubList } from "#/components/items/types/weapons/attackCalculator/weaponAttackHubList.tsx"
import { WeaponAttackPanel } from "#/components/items/types/weapons/attackCalculator/weaponAttackPanel.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"

interface WeaponAttackDialogProps extends ControlledDialogProps<void> {
  weapon: WeaponData
}

const WeaponAttackDialog: FC<WeaponAttackDialogProps> = ({ ctrl, weapon }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))

  const equippedWeapons = useGearByType<WeaponData>(ItemType.weapon)
    .filter((item) => !item.parentId && item.equipped)
  const weapons = equippedWeapons.some((item) => item.id === weapon.id)
    ? equippedWeapons
    : [weapon, ...equippedWeapons]

  // null = the hub (weapon list); a weapon id = that weapon's wizard is drilled into. Starts
  // on the weapon that was clicked rather than the hub, since the Attack button already
  // picked one — the back button still reaches the hub to attack with a different weapon.
  const [activeWeaponId, setActiveWeaponId] = useState<string | null>(weapon.id)
  const activeWeapon = weapons.find((item) => item.id === activeWeaponId) ?? null

  const goToHub = () => setActiveWeaponId(null)

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" fullScreen={isNarrowViewport} onClosed={goToHub}>
      <Dialog.Title>
        {activeWeapon
          ? (
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <IconButton aria-label="Back to weapons" onClick={goToHub}>
                  <RiArrowLeftLine size={20} />
                </IconButton>
                <Box sx={{ flex: 1 }}>{activeWeapon.name}</Box>
                {/* Spacer mirrors the back button so the title stays centered. */}
                <Box sx={{ width: 36 }} />
              </Stack>
            )
          : "Attack Calculator"}
      </Dialog.Title>

      <Dialog.Content dividers>
        <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
          {activeWeapon === null
            ? <WeaponAttackHubList weapons={weapons} onSelectWeapon={setActiveWeaponId} />
            : <WeaponAttackPanel key={activeWeapon.id} weapon={activeWeapon} />}
        </Box>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Close</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseWeaponAttackDialogProps = Omit<WeaponAttackDialogProps, keyof ControlledDialogProps<void>>

export const useWeaponAttackDialog = () => useDialog<void, UseWeaponAttackDialogProps>(
  (ctrl, props) => <WeaponAttackDialog ctrl={ctrl} {...props} />,
)
