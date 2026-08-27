import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { KnownNodesList } from "#/components/runner/matrix/knownNodesList.tsx"
import { MatrixProgramsSection } from "#/components/runner/matrix/matrixProgramsSection.tsx"
import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { DamageSelectors } from "#/stores/runner/damage/damageSlice.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"

export const Route = createFileRoute("/$runnerId/_viewer/matrix")({
  component: RouteComponent,
})

function RouteComponent() {
  const dispatch = useRunnerStoreDispatch()
  const matrix = useRunnerSelector(DamageSelectors.track.matrix, { system: 0 })

  return (
    <Stack>
      <SectionHeader>Matrix</SectionHeader>

      <UnderConstruction description="Matrix tests, loaded program limits, and dice pool calculations aren't implemented yet. For now, track Matrix damage and manage your Known Nodes and programs here." />

      <KnownNodesList />

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
