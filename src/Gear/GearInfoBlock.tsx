import { faWifi } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Paper, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import { FC } from "react"

import { calculateAttributes } from "../System/Attribute"
import { AttributeProvider } from "../System/AttributeProvider"
import { formatNuyen } from "../System/Nuyen"
import { formatSource } from "../System/Source"
import { AttributeBlock } from "../UI/AttributeBlock"
import { InfoBlock } from "../UI/InfoBlock/InfoBlock"
import { Stat } from "../UI/StatBlock"
import { formatAvail } from "./Availability"
import { useAttachedGear } from "./GearContext"
import { GearInfoProps } from "./GearInfo"
import { GearList } from "./GearList"

export const GearInfoBlock: FC<GearInfoProps> = ({ item, children }) => {
  const blockTitleRight = (
    <Box sx={{ fontSize: 10, textAlign: "right" }}>
      {item.avail && <Stat name="Avail" value={formatAvail(item.avail)} />}
      {item.cost && <Stat name="Cost" value={formatNuyen(item.cost)} />}
      {item.source && <Stat name="Source" value={formatSource(item.source)} />}
    </Box>
  )

  const attachedGear = useAttachedGear(item.id)

  const expandable = Boolean(
    item.description ||
      item.wirelessBonus ||
      item.attributes ||
      children ||
      attachedGear.length > 0,
  )

  const attributes = calculateAttributes(item.attributes || {}, attachedGear)

  return (
    <AttributeProvider attributes={attributes}>
      <InfoBlock
        title={item.name}
        quantity={item.quantity || 0}
        subtitle={item.type}
        titleRight={blockTitleRight}
        expandable={expandable}
        expandId={item.id || null}
        content={
          <>
            {item.description && <ItemDescription text={item.description} />}

            {item.wirelessBonus && (
              <WirelessBonus description={item.wirelessBonus.description} />
            )}

            <AttributeBlock attributes={attributes} />

            {children}
          </>
        }
        footer={
          <>
            {attachedGear.length >= 1 && (
              <Paper variant="outlined" sx={{ padding: 1 }}>
                <GearList gear={attachedGear} />
              </Paper>
            )}
          </>
        }
      />
    </AttributeProvider>
  )
}

interface ItemDescriptionProps {
  text: string
}

export const ItemDescription: FC<ItemDescriptionProps> = ({ text }) => {
  return (
    <Typography
      variant="caption"
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <Box sx={{ flexGrow: 1 }}>{text}</Box>
    </Typography>
  )
}

interface WirelessBonusProps {
  description: string
}

export const WirelessBonus: FC<WirelessBonusProps> = ({ description }) => {
  return (
    <Typography
      variant="caption"
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <FontAwesomeIcon icon={faWifi} />
      <Box sx={{ flexGrow: 1 }}>{description}</Box>
    </Typography>
  )
}
