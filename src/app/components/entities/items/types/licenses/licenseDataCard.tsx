import type { FC } from "react"

import { ItemCard } from "#app/components/ui/cards/itemCard/itemCard.tsx"
import type { LicenseData } from "#data/items/licenseData.ts"
import { Actions } from "#state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#state/runner/runnerStore.dispatch.ts"

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
      onOpen={onOpen}
      onEdit={onEdit}
      onRemove={removeLicense}
    />
  )
}
