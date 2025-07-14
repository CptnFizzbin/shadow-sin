import { TableCell, TableRow } from "@mui/material"
import { FC } from "react"

import { formatNuyen } from "../../../System/Nuyen"
import { AwakenedType } from "../../AwakenedType"
import { formatMetatype, MetatypeId } from "../../Metatype"
import { PriorityStat, PriorityValues } from "./Priorities"

interface PriorityRowProps {
  level: string
  values: PriorityValues
  selectedType?: PriorityStat
  metatypeId: MetatypeId
  awakened: AwakenedType

  onSelect(level: string, type: PriorityStat): void
}

export const PriorityRow: FC<PriorityRowProps> = ({
  level,
  values,
  selectedType,
  metatypeId,
  awakened,
  onSelect,
}) => {
  return (
    <TableRow
      sx={{
        "& .priority-cell:hover, & .priority-cell.selected": {
          backgroundColor: "primary.dark",
        },
      }}
    >
      <TableCell align="center">{level}</TableCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.metatype)}
        selected={selectedType === PriorityStat.metatype}
      >
        {values.metatypes.includes(metatypeId) ? (
          <>
            {formatMetatype(metatypeId)} ({values.adjustmentPoints})
          </>
        ) : (
          "-"
        )}
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.attributes)}
        selected={selectedType === PriorityStat.attributes}
      >
        {values.attributePoints}
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.skills)}
        selected={selectedType === PriorityStat.skills}
      >
        {values.skillPoints}
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.magic)}
        selected={selectedType === PriorityStat.magic}
      >
        {values.magic === 0 ? (
          <>{awakened === AwakenedType.Mundane ? "Mundane" : "-"}</>
        ) : (
          <>
            {awakened === AwakenedType.Mundane && "-"}
            {awakened === AwakenedType.Full && values.magic + " Magic"}
            {awakened === AwakenedType.Aspected && values.magic + 1 + " Magic"}
            {awakened === AwakenedType.Mystic && values.magic + " Magic"}
            {awakened === AwakenedType.Adept && values.magic + " Magic"}
            {awakened === AwakenedType.Technomancer &&
              values.magic + " Resonance"}
          </>
        )}
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.nuyen)}
        selected={selectedType === PriorityStat.nuyen}
      >
        {formatNuyen(values.nuyen)}
      </PriorityCell>
    </TableRow>
  )
}

interface PriorityCellProps {
  selected?: boolean

  onClick(): void
}

export const PriorityCell: FC<PriorityCellProps> = ({
  selected,
  onClick,
  children,
}) => {
  return (
    <TableCell
      onClick={onClick}
      className={selected ? "priority-cell selected" : "priority-cell"}
    >
      {children}
    </TableCell>
  )
}
