import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import {
  RiCarLine,
  RiCpuLine,
  RiIdCardLine,
  RiShapesLine,
  RiShieldLine,
  RiSmartphoneLine,
  RiSwordLine,
} from "@remixicon/react"
import type { FC } from "react"

import { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import type { IconComponent } from "#/lib/icons.ts"

const categoryIcons: Record<GearSection, IconComponent> = {
  [GearSection.Cyberware]: RiCpuLine,
  [GearSection.Weapons]: RiSwordLine,
  [GearSection.Armor]: RiShieldLine,
  [GearSection.Vehicles]: RiCarLine,
  [GearSection.Devices]: RiSmartphoneLine,
  [GearSection.Licenses]: RiIdCardLine,
  [GearSection.Misc]: RiShapesLine,
}

interface AddItemCategoryStepProps {
  onSelect: (section: GearSection) => void
}

/** Step 1 of the Add Item workflow — pick which gear category to add to. */
export const AddItemCategoryStep: FC<AddItemCategoryStepProps> = ({ onSelect }) => (
  <List sx={{ padding: 0 }}>
    {Object.values(GearSection).map((section) => {
      const Icon = categoryIcons[section]
      return (
        <ListItemButton key={section} onClick={() => onSelect(section)} sx={{ borderRadius: 1 }}>
          <ListItemIcon>
            <Icon size={20} />
          </ListItemIcon>
          <ListItemText primary={section} />
        </ListItemButton>
      )
    })}
  </List>
)
