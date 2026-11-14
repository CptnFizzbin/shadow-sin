import Box from "@mui/material/Box"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Tooltip from "@mui/material/Tooltip"

import { itemFormOpts } from "#/hooks/items/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import {
  getAllowedItemStates,
  getItemStateLabel,
  isItemStateWithinParent,
} from "#/system/formulas/items/itemStateRules.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

/**
 * A toggle with one button per Item State the item's type allows (e.g. [Equipped | Available |
 * Stashed], or [Loaded | Stashed] for a Program), writing the item's `state`. When the item is an
 * Attachment, states more present than its parent (`parentState`) are disabled.
 */
export const GearStateFieldGroup = withFieldGroup({
  ...itemFormOpts,
  props: {
    itemType: ItemType.other as ItemType,
    parentState: undefined as ItemState | undefined,
  },
  render: ({ group, itemType, parentState }) => {
    return (
      <group.Field name="state">
        {(stateField) => (
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            aria-label="Item state"
            value={stateField.state.value ?? ItemState.available}
            onChange={(_, next: ItemState | null) => {
              if (next) stateField.handleChange(next)
            }}
          >
            {getAllowedItemStates(itemType).map((state) => {
              const label = getItemStateLabel(itemType, state)
              const blockedByParent = !isItemStateWithinParent(state, parentState)

              return blockedByParent
                ? (
                    <Tooltip key={state} title="Can't be more active than the item it's attached to">
                      {/* A disabled button fires no events, so the tooltip needs a wrapper to anchor to. */}
                      <Box component="span" sx={{ display: "flex", flex: 1 }}>
                        <ToggleButton value={state} disabled sx={{ flex: 1 }}>{label}</ToggleButton>
                      </Box>
                    </Tooltip>
                  )
                : <ToggleButton key={state} value={state}>{label}</ToggleButton>
            })}
          </ToggleButtonGroup>
        )}
      </group.Field>
    )
  },
})
