import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import { FC } from "react"

import { GearAvailCost } from "./GearAvailCost"
import { GearData } from "./GearData"

export interface GearHeaderProps {
  item: GearData
  type?: string
}

export const GearHeader: FC<GearHeaderProps> = ({ item, type }) => {
  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            sx={{ display: "inline-block", color: "primary.main" }}
          >
            {item.name}
          </Typography>
        </Box>
        <GearAvailCost item={item} />
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{type || item.type}</Typography>
        </Box>

        {item.source && (
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="overline">
              {item.source === "Homebrew" ? (
                "Homebrew"
              ) : (
                <>
                  {item.source.book} p.{item.source.page}
                </>
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
