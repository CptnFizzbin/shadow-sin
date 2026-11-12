import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import { itemFormOpts } from "#/hooks/items/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

type CarryStatus = "equipped" | "carried" | "stashed"

/**
 * [Equipped | Carried | Stashed] picker for where the item is: one choice at a time, writing the
 * item's `equipped` and `stashed` fields. Carried means neither. `canEquip`/`canStash` hide the
 * choices the item doesn't support.
 */
export const GearCarryStatusFieldGroup = withFieldGroup({
  ...itemFormOpts,
  props: {
    canEquip: false as boolean,
    canStash: false as boolean,
  },
  render: ({ group, canEquip, canStash }) => {
    return (
      <group.Field name="equipped">
        {(equippedField) => (
          <group.Field name="stashed">
            {(stashedField) => {
              const status: CarryStatus = stashedField.state.value
                ? "stashed"
                : (equippedField.state.value ? "equipped" : "carried")

              const handleChange = (next: CarryStatus | null) => {
                if (!next) return
                if (canEquip) equippedField.handleChange(next === "equipped")
                if (canStash) stashedField.handleChange(next === "stashed")
              }

              return (
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  size="small"
                  aria-label="Carry status"
                  value={status}
                  onChange={(_, next: CarryStatus | null) => handleChange(next)}
                >
                  {canEquip && <ToggleButton value="equipped">Equipped</ToggleButton>}
                  <ToggleButton value="carried">Carried</ToggleButton>
                  {canStash && <ToggleButton value="stashed">Stashed</ToggleButton>}
                </ToggleButtonGroup>
              )
            }}
          </group.Field>
        )}
      </group.Field>
    )
  },
})
