import type { ReactNode } from "react"

import type { SelectOption } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import { itemFormOpts } from "#/lib/hooks/items/forms/useItemForm.tsx"

export const GearAttachmentFieldGroup = withFieldGroup({
  ...itemFormOpts,
  props: {
    isFixed: false as boolean,
    parentItemOptions: [] as SelectOption[],
    fieldLabel: "Parent Item" as string,
    attachmentSlot: undefined as (() => ReactNode) | undefined,
  },
  render: ({ group, isFixed, parentItemOptions, fieldLabel, attachmentSlot }) => {
    return (
      <>
        <group.AppField name="items.parentId">
          {(field) => (
            <field.SelectField
              label={fieldLabel}
              size="small"
              fullWidth
              nullable
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
