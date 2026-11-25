import type { GearSection } from "#/components/entities/items/viewer/gearSectionTypes.ts"
import { createWorkflow, useWorkflow } from "#/components/ui/workflow/createWorkflow.tsx"

export enum AddItemTypeStep {
  Category = "Category",
  Subtype = "Subtype",
}

interface AddItemTypeWorkflowData {
  section: GearSection | null
}

export const AddItemTypeWorkflow = createWorkflow<AddItemTypeWorkflowData, AddItemTypeStep>()

export const useAddItemTypeWorkflow = () => useWorkflow(AddItemTypeWorkflow)
