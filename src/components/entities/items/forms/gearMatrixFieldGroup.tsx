import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"

import { itemFormOpts } from "#/hooks/items/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

/** Checkbox for whether the item has a Matrix presence. Checked by default; unchecking sets `matrixDisabled`. */
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
