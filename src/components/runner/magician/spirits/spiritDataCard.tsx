import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SpiritCard } from "#/components/spiritCard/spiritCard.tsx"
import { AttributeKey, MentalAttributes, PhysicalAttributes } from "#/system/attributeKey.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import {
  calculateSpiritAttributes,
  calculateSpiritConditionMonitor,
  calculateSpiritInitiative,
  SpiritTypeLabels
} from "#/system/magic/spiritData.ts"
import { SpiritRegistry } from "#/system/magic/spiritRegistry.ts"

import { CritterPowerChip } from "./critterPowerChip.tsx"
import { attrValue } from "#/system/attributes/attributeCatalog.ts"

const SPIRIT_SPECIAL_ATTRS = [AttributeKey.edge, AttributeKey.magic] as const

interface SpiritDataCardProps {
  spirit: SpiritData
  onEdit: () => void
  onRemove: () => void
  onDamageChange: (damage: SpiritData["damage"]) => void
}

export const SpiritDataCard: FC<SpiritDataCardProps> = ({ spirit, onEdit, onRemove, onDamageChange }) => {
  const title = spirit.name || SpiritTypeLabels[spirit.spiritType]

  const { physicalScore, physicalIp, astralBase, astralIp } = calculateSpiritInitiative(spirit.force, spirit.spiritType)
  const attrs = calculateSpiritAttributes(spirit.force, spirit.spiritType)
  const { physical: physicalMax, stun: stunMax } = calculateSpiritConditionMonitor(spirit.force, spirit.spiritType)
  const registry = SpiritRegistry[spirit.spiritType]

  return (
    <SpiritCard id={spirit.id} name={title} kind={spirit.kind} onEdit={onEdit} onRemove={onRemove}>
      {spirit.name && (
        <SpiritCard.Layout.HeaderRow>
          <SpiritCard.SubType label={SpiritTypeLabels[spirit.spiritType]} />
        </SpiritCard.Layout.HeaderRow>
      )}

      <SpiritCard.Layout.BodyRow sx={{ flexWrap: "wrap" }}>
        <SpiritCard.Stat label="Force" value={spirit.force} />
        <SpiritCard.Stat label="Services" value={`${spirit.services.used}/${spirit.services.max}`} />
        <SpiritCard.Stat label="Init" value={`${physicalScore} (${physicalIp}IP)`} />
        <SpiritCard.Stat label="Astral" value={`${astralBase} (${astralIp}IP)`} />
        {registry.movement && <SpiritCard.Stat label="Move" value={registry.movement} />}
        {spirit.bound && <SpiritCard.Stat value="Bound" type="rating" />}
      </SpiritCard.Layout.BodyRow>

      {registry.skills.length > 0 && (
        <SpiritCard.Layout.BodyRow>
          <SpiritCard.SkillList
            skills={registry.skills.map((skill) => ({
              name: skill.name,
              pool: spirit.force + attrValue(attrs, skill.attribute),
            }))}
          />
        </SpiritCard.Layout.BodyRow>
      )}

      <SpiritCard.Layout.BodyRow>
        <SpiritCard.PowerList>
          {registry.basePowers.map((power) => (
            <CritterPowerChip key={power} name={power} force={spirit.force} attrs={attrs} />
          ))}
        </SpiritCard.PowerList>
      </SpiritCard.Layout.BodyRow>

      {spirit.optionalPowers.length > 0 && (
        <SpiritCard.Layout.BodyRow>
          <SpiritCard.PowerList label="Optional Powers">
            {spirit.optionalPowers.map((power) => (
              <CritterPowerChip key={power} name={power} force={spirit.force} attrs={attrs} color="secondary" />
            ))}
          </SpiritCard.PowerList>
        </SpiritCard.Layout.BodyRow>
      )}

      {spirit.notes && (
        <SpiritCard.Layout.BodyRow>
          <SpiritCard.Notes value={spirit.notes} />
        </SpiritCard.Layout.BodyRow>
      )}

      <SpiritCard.Layout.BodyRow>
        <SpiritCard.AttributeBlock
          values={attrs}
          groups={[PhysicalAttributes, MentalAttributes, SPIRIT_SPECIAL_ATTRS]}
        />
      </SpiritCard.Layout.BodyRow>

      <SpiritCard.Layout.BodyRow>
        <Stack sx={{ flexGrow: 1 }}>
          <SpiritCard.DamageTrack
            label="Physical"
            max={physicalMax}
            current={spirit.damage.physical}
            onChange={(physical) => onDamageChange({ ...spirit.damage, physical })}
          />
        </Stack>
        <Stack sx={{ flexGrow: 1 }}>
          <SpiritCard.DamageTrack
            label="Stun"
            max={stunMax}
            current={spirit.damage.stun}
            onChange={(stun) => onDamageChange({ ...spirit.damage, stun })}
          />
        </Stack>
      </SpiritCard.Layout.BodyRow>
    </SpiritCard>
  )
}
