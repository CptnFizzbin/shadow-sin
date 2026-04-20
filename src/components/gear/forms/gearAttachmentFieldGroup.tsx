import type { ReactNode } from "react"

import { gearItemFormOpts } from "#/components/gear/forms/useItemForm.tsx"
import type { SelectOption } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"

export const GearAttachmentFieldGroup = withFieldGroup({
  ...gearItemFormOpts,
  props: {
    isFixed: false as boolean,
    parentItemOptions: [] as SelectOption[],
    attachmentSlot: undefined as (() => ReactNode) | undefined,
  },
  render: ({ group, isFixed, parentItemOptions, attachmentSlot }) => {
    return (
      <>
        <group.AppField name="parentId">
          {(field) => (
            <field.SelectField
              label="Parent Item"
              size="small"
              fullWidth
              options={[{ label: "—", value: "" }, ...parentItemOptions]}
              slotProps={{
                select: { disabled: isFixed },
              }}
            />
          )}
        </group.AppField>

        {attachmentSlot?.()}
      </>
    )
  },
})
