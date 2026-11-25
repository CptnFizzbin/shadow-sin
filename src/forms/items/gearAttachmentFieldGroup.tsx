import type { ReactNode } from "react"
import { z } from "zod"

import type { SelectOption } from "#/forms/tanstackForm/fields/selectField.tsx"
import { withFieldGroup } from "#/forms/tanstackForm/useAppForm.ts"

import { itemFormOpts } from "./useItemForm.tsx"

export const GearAttachmentFieldGroup = withFieldGroup({
  ...itemFormOpts,
  props: {
    isFixed: false as boolean,
    parentItemOptions: [] as SelectOption[],
    fieldLabel: "Parent Item" as string,
    required: false as boolean,
    attachmentSlot: undefined as (() => ReactNode) | undefined,
  },
  render: ({ group, isFixed, parentItemOptions, fieldLabel, required, attachmentSlot }) => {
    return (
      <>
        <group.AppField
          name="items.parentId"
          validators={required
            ? { onChange: z.string(`${fieldLabel} is required`).min(1, `${fieldLabel} is required`) }
            : undefined}
        >
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
