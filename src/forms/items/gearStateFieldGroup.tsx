import Box from "@mui/material/Box"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Tooltip from "@mui/material/Tooltip"

import { ItemState } from "#data/items/itemState.ts"
import { ItemType } from "#data/items/itemType.ts"
import { withFieldGroup } from "#forms/tanstackForm/useAppForm.ts"
import {
  getActiveItemState,
  getAllowedItemStates,
  getItemStateLabel,
  isItemStateWithinParent,
} from "#rules/items/itemStateRules.ts"

import { itemFormOpts } from "./useItemForm.tsx"

/**
 * A toggle with one button per Item State the item's type allows (e.g. [Equipped | Available |
 * Stashed], or [Loaded | Stashed] for a Program), writing the item's `state`. When the item is an
 * Attachment, states more present than its parent (`parentState`) are disabled. When
 * `activeBlockedReason` is given, the item's active state is disabled too, with that reason shown.
 */
export const GearStateFieldGroup = withFieldGroup({
  ...itemFormOpts,
  props: {
    itemType: ItemType.other as ItemType,
    parentState: undefined as ItemState | undefined,
    activeBlockedReason: undefined as string | undefined,
  },
  render: ({ group, itemType, parentState, activeBlockedReason }) => {
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
              const blockedReason = activeBlockedReason && state === getActiveItemState(itemType)
                ? activeBlockedReason
                : blockedByParent ? "Can't be more active than the item it's attached to" : undefined

              return blockedReason
                ? (
                    <Tooltip key={state} title={blockedReason}>
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
