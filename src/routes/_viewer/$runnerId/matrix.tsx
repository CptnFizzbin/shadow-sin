import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { MatrixProgramsSection } from "#/components/runner/matrix/matrixProgramsSection.tsx"
import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

export const Route = createFileRoute("/_viewer/$runnerId/matrix")({
  component: RouteComponent,
})

function RouteComponent() {
  const dispatch = useRunnerStoreDispatch()
  const matrix = useRunnerStoreSelector(Selectors.damage.selectMatrixTrack)

  return (
    <Stack sx={{ gap: 1 }}>
      <SectionHeader>Matrix</SectionHeader>

      <UnderConstruction description="Matrix tests, loaded program limits, and dice pool calculations aren't implemented yet. For now, track Matrix damage and keep a list of your programs here." />

      <DamageTrack
        label="Matrix"
        max={matrix.max}
        current={matrix.current}
        woundInterval={matrix.woundInterval}
        allowOverflow
        onChange={(newValue) => dispatch(Actions.damage.setDamage({ track: DamageTrackKey.matrix, value: newValue }))}
      />

      <MatrixProgramsSection />
    </Stack>
  )
}
