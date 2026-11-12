import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"

import { itemFormOpts } from "#/hooks/items/forms/useItemForm.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

/** Switch for whether the item has a Matrix presence. On by default; turning it off sets `matrixDisabled`. */
export const GearMatrixFieldGroup = withFieldGroup({
  ...itemFormOpts,
  render: ({ group }) => {
    return (
      <group.Field name="matrixDisabled">
        {(field) => (
          <FormControlLabel
            control={(
              <Switch
                checked={!field.state.value}
                onChange={(_, checked) => field.handleChange(!checked)}
              />
            )}
            label="Matrix Presence"
          />
        )}
      </group.Field>
    )
  },
})
