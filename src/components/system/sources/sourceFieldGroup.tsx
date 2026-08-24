import Stack from "@mui/material/Stack"

import { withFieldGroup } from "#/integrations/tanstackForm/useAppForm.ts"
import type { SourceData } from "#/system/sourceData.ts"
import { bookOptions } from "#/system/sourceData.ts"

interface SourceFormFieldsProps {
  source?: SourceData
}

const defaultValues: SourceFormFieldsProps = {
  source: {
    book: "",
    page: 0,
  },
}

export const SourceFieldGroup = withFieldGroup({
  defaultValues: defaultValues,
  render: ({ group }) => {
    return (
      <Stack direction="row">
        <group.AppField
          name="source.book"
          listeners={{
            onChange: ({ value }) => {
              if (value === "") {
                group.setFieldValue("source", undefined)
              }
            },
          }}
        >
          {(field) => (
            <field.SelectField
              label="Book"
              size="small"
              fullWidth
              sx={{ flexGrow: 1 }}
              options={[{ label: "", value: "" }, ...bookOptions]}
            />
          )}
        </group.AppField>

        <group.AppField name="source.page">
          {(field) => (
            <field.NumberField label="Page" size="small" sx={{ width: 150 }} />
          )}
        </group.AppField>
      </Stack>
    )
  },
})
