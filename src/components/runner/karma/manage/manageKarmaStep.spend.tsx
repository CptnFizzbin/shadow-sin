import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"

import { SpendKarmaHubList } from "#/components/runner/karma/improvements/spendKarmaHubList.tsx"
import { SpendKarmaSectionContent } from "#/components/runner/karma/improvements/spendKarmaSections.tsx"

import { useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"

/** Spend Karma step: the improvement categories, or the improvements in the one drilled into. */
export const ManageKarmaStepSpend: FC = () => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const workflow = useManageKarmaWorkflow()
  const { spendSection } = workflow.data

  return (
    <Box sx={{ minHeight: isNarrowViewport ? undefined : 420 }}>
      {spendSection === null
        ? (
            <SpendKarmaHubList
              onSelectSection={(section) => workflow.setData((data) => {
                data.spendSection = section
              })}
            />
          )
        : <SpendKarmaSectionContent section={spendSection} />}
    </Box>
  )
}
