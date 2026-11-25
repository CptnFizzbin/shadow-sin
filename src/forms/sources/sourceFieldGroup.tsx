import Stack from "@mui/material/Stack"

import type { SourceData } from "#/data/source/sourceData.ts"
import { bookOptions } from "#/data/source/sourceData.ts"
import { withFieldGroup } from "#/forms/tanstackForm/useAppForm.ts"

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
