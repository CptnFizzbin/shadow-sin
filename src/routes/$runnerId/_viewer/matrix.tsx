import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import { KnownNodesList } from "#/components/system/matrix/knownNodesList.tsx"
import { MatrixProgramsSection } from "#/components/system/matrix/matrixProgramsSection.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { UnderConstruction } from "#/components/ui/underConstruction.tsx"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"

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
