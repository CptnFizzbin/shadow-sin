import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import { AvailableGearFilter } from "#app/components/entities/items/viewer/availableGearFilter.tsx"
import DamageTrack from "#app/components/system/damage/damageTrack.tsx"
import { KnownNodesList } from "#app/components/system/matrix/knownNodesList.tsx"
import { MatrixAgentsSection } from "#app/components/system/matrix/matrixAgentsSection.tsx"
import { MatrixProgramsSection } from "#app/components/system/matrix/matrixProgramsSection.tsx"
import { DamageTrackKey } from "#data/entities/damageTrackKey.ts"
import { DamageSelectors } from "#state/runner/damage/damage.selector.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"
import { UnderConstruction } from "#ui/alerts/underConstruction.tsx"
import { SectionHeader } from "#ui/text/sectionHeader.tsx"

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

      <AvailableGearFilter>
        <MatrixAgentsSection />
      </AvailableGearFilter>

      <DamageTrack
        label="Matrix"
        max={matrix.max}
        current={matrix.current}
        woundInterval={matrix.woundInterval}
        allowOverflow
        onChange={(newValue) => dispatch(Actions.damage.setDamage({ track: DamageTrackKey.matrix, value: newValue }))}
      />

      <AvailableGearFilter>
        <MatrixProgramsSection />
      </AvailableGearFilter>
    </Stack>
  )
}
