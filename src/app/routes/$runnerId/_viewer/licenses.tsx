import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { createFileRoute } from "@tanstack/react-router"

import { useLicenseFormDialog } from "#/app/components/entities/items/types/licenses/dialogs/licenseFormDialog.tsx"
import { useSinFormDialog } from "#/app/components/entities/items/types/licenses/dialogs/sinFormDialog.tsx"
import { SinsAndLicensesSection } from "#/app/components/entities/items/types/licenses/sinsAndLicensesSection.tsx"
import { AvailableGearFilter } from "#/app/components/entities/items/viewer/availableGearFilter.tsx"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

export const Route = createFileRoute("/$runnerId/_viewer/licenses")({
  component: RouteComponent,
})

function RouteComponent() {
  const dispatch = useRunnerStoreDispatch()
  const sinFormDialog = useSinFormDialog()
  const licenseFormDialog = useLicenseFormDialog()

  const handleAddSin = async () => {
    const sin = await sinFormDialog.open({ wizard: true })
    if (sin) dispatch(Actions.item.addItem(sin))
  }

  const handleAddLicense = async () => {
    const license = await licenseFormDialog.open({ wizard: true })
    if (license) dispatch(Actions.item.addItem(license))
  }

  return (
    <Stack>
      <SectionHeader>SINs & Licenses</SectionHeader>

      <ButtonGroup size="small" color="secondary" sx={{ "& > .MuiButton-root": { flexGrow: 1 } }}>
        <Button startIcon={<RiAddLine size={14} />} onClick={handleAddSin}>
          Add SIN
        </Button>
        <Button startIcon={<RiAddLine size={14} />} onClick={handleAddLicense}>
          Add License
        </Button>
      </ButtonGroup>

      <AvailableGearFilter>
        <SinsAndLicensesSection />
      </AvailableGearFilter>

      {sinFormDialog.outlet}
      {licenseFormDialog.outlet}
    </Stack>
  )
}
