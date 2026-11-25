import { drugFormOpts } from "#forms/items/types/consumables/useDrugForm.tsx"
import { withFieldGroup } from "#forms/tanstackForm/useAppForm.ts"
import { Label } from "#ui/text/label.tsx"

export const DrugFormFields = withFieldGroup({
  ...drugFormOpts,
  render: ({ group }) => {
    return (
      <>
        <Label label="Drug" />

        <group.AppField name="duration">
          {(field) => <field.TextField label="Duration" fullWidth size="small" placeholder="e.g. 10 × 1D6 minutes" />}
        </group.AppField>

        <group.AppField name="effectDescription">
          {(field) => <field.TextField label="Effects" fullWidth multiline rows={3} />}
        </group.AppField>

        <group.AppField name="crash">
          {(field) => <field.TextField label="Crash" fullWidth multiline rows={2} />}
        </group.AppField>
      </>
    )
  },
})
