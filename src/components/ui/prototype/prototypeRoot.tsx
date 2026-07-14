import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import type { FC, ReactElement, ReactNode } from "react"
import { Children, isValidElement, useState } from "react"

import type { PrototypeItemProps } from "./prototypeItem.tsx"
import { PrototypeItem } from "./prototypeItem.tsx"

function isPrototypeItem(item: ReactNode): item is ReactElement<PrototypeItemProps> {
  return isValidElement(item) && item.type === PrototypeItem
}

export interface PrototypeRootProps {
  children: ReactNode
}

export const PrototypeRoot: FC<PrototypeRootProps> = ({ children }) => {
  const items = Children.toArray(children).filter(isPrototypeItem)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const activeIndex = items.length === 0 ? 0 : Math.min(selectedIndex, items.length - 1)
  const selected = items[activeIndex]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <Tabs
        value={activeIndex}
        onChange={(_, index: number) => setSelectedIndex(index)}
        variant="scrollable"
        allowScrollButtonsMobile
        scrollButtons="auto"
      >
        {items.map((item, index) => (
          <Tab key={index} label={item.props.title} value={index} />
        ))}
      </Tabs>
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {selected}
      </Box>
    </Box>
  )
}

PrototypeRoot.displayName = "Prototype"
