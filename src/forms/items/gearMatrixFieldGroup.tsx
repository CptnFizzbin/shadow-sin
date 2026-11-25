import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"

import { withFieldGroup } from "#forms/tanstackForm/useAppForm.ts"

import { itemFormOpts } from "./useItemForm.tsx"

/**
 * Checkbox for whether the item has a Matrix presence: checked unless `matrixDisabled` is set, and
 * writing `matrixDisabled` either way.
 */
export const GearMatrixFieldGroup = withFieldGroup({
  ...itemFormOpts,
  render: ({ group }) => {
    return (
      <group.Field name="matrixDisabled">
        {(field) => (
          <FormControlLabel
            label="Has Matrix presence"
            control={(
              <Checkbox
                checked={!field.state.value}
                onChange={(_, checked) => field.handleChange(!checked)}
              />
            )}
          />
        )}
      </group.Field>
    )
  },
})
