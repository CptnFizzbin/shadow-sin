import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"

interface LicenseDataCardProps {
  license: LicenseData
  onOpen?: () => void
  onEdit?: () => void
}

export const LicenseDataCard: FC<LicenseDataCardProps> = ({ license, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()

  const removeLicense = () => dispatch(Actions.item.licenses.destroy(license.id))

  return (
    <ItemCard
      item={license}
      ratingOverride={license.isReal ? "Real" : license.rating}
      onOpen={onOpen}
      onEdit={onEdit}
      onRemove={removeLicense}
    />
  )
}
