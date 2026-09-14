import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import type { FC } from "react"

import { weaponTypeOptions } from "#/components/entities/items/types/weapons/forms/weaponFormFields.tsx"
import { GearSection } from "#/components/entities/items/viewer/gearSectionTypes.ts"
import type { AddItemSectionWithSubtype, AddItemSelection, LicenseKind } from "#/system/model/items/addItemSelection.ts"
import { VehicleCategory } from "#/system/model/items/vehicleData.ts"

const licenseKindOptions: { label: string, value: LicenseKind }[] = [
  { label: "SIN", value: "sin" },
  { label: "License", value: "license" },
]

const vehicleCategoryOptions = [
  { label: "Vehicle", value: VehicleCategory.vehicle },
  { label: "Drone", value: VehicleCategory.drone },
]

interface AddItemSubtypeStepProps {
  section: AddItemSectionWithSubtype
  onSelect: (selection: AddItemSelection) => void
}

/** Step 2 of the Add Item workflow — pick which concrete gear type within the chosen category. */
export const AddItemSubtypeStep: FC<AddItemSubtypeStepProps> = ({ section, onSelect }) => {
  if (section === GearSection.Weapons) {
    return (
      <List sx={{ padding: 0 }}>
        {weaponTypeOptions.map((option) => (
          <ListItemButton
            key={option.value}
            onClick={() => onSelect({ section, weaponType: option.value })}
            sx={{ borderRadius: 1 }}
          >
            <ListItemText primary={option.label} />
          </ListItemButton>
        ))}
      </List>
    )
  }

  if (section === GearSection.Vehicles) {
    return (
      <List sx={{ padding: 0 }}>
        {vehicleCategoryOptions.map((option) => (
          <ListItemButton
            key={option.value}
            onClick={() => onSelect({ section, vehicleCategory: option.value })}
            sx={{ borderRadius: 1 }}
          >
            <ListItemText primary={option.label} />
          </ListItemButton>
        ))}
      </List>
    )
  }

  return (
    <List sx={{ padding: 0 }}>
      {licenseKindOptions.map((option) => (
        <ListItemButton
          key={option.value}
          onClick={() => onSelect({ section, licenseKind: option.value })}
          sx={{ borderRadius: 1 }}
        >
          <ListItemText primary={option.label} />
        </ListItemButton>
      ))}
    </List>
  )
}
