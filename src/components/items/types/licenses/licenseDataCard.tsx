import type { FC } from "react"

import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"

interface LicenseDataCardProps {
  license: LicenseData
  onOpen?: () => void
  onEdit?: () => void
}

export const LicenseDataCard: FC<LicenseDataCardProps> = ({ license, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()

  const removeLicense = () => dispatch(Actions.gear.licenses.destroy(license.id))

  return (
    <ItemDataCardRoot item={license} onOpen={onOpen} onEdit={onEdit} onRemove={removeLicense} />
  )
}
