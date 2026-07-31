import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"

interface LicenseCardProps {
  license: LicenseData
  onOpen?: () => void
}

export const LicenseCard: FC<LicenseCardProps> = ({ license, onOpen }) => {
  const dispatch = useRunnerStoreDispatch()

  const removeLicense = () => dispatch(Actions.gear.licenses.destroy(license.id))

  return (
    <BasicItemCard item={license} onOpen={onOpen} onRemove={removeLicense}>
      <ItemCardSlot.Stat
        value={license.rating === "real" ? "Real" : `Rating: ${license.rating}`}
        type="rating"
      />

      {license.cost !== undefined && (
        <ItemCardSlot.Footer>
          <Nuyen amount={license.cost} />
        </ItemCardSlot.Footer>
      )}
    </BasicItemCard>
  )
}
