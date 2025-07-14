import { Typography } from "@mui/material"
import { FC } from "react"

import { formatNuyen } from "../../System/Nuyen"
import { formatSource } from "../../System/Source"
import { SimpleInfoBlock } from "../../UI/InfoBlock/SimpleInfoBlock"
import { Stat } from "../../UI/StatBlock"
import { GearInfoProps } from "../GearInfo"
import { LicenseAttr } from "./LicenseAttr"
import { LicenseData } from "./LicenseData"

export const LicenseInfo: FC<GearInfoProps<LicenseData>> = ({
  item: license,
}) => {
  return (
    <SimpleInfoBlock
      name={license.name}
      attributes={
        <>
          {license.cost && (
            <Stat name="Cost" value={formatNuyen(license.cost)} />
          )}
          {license.source && (
            <Stat name="Source" value={formatSource(license.source)} />
          )}
          <Stat name="Rating" value={license.attributes[LicenseAttr.rating]} />
        </>
      }
    >
      <Typography variant="caption">{license.type}</Typography>
    </SimpleInfoBlock>
  )
}
