import { FC } from "react"

import { useAllGear } from "../../Gear/GearContext"
import { KitAttr } from "../../Gear/Kit/KitAttr"
import { KitType } from "../../Gear/Kit/KitType"
import { OtherGearData } from "../../Gear/OtherGearData"
import { ActiveSkillIds } from "../../Skills"
import { DamageType } from "../../System/Damage/DamageType"
import {
  DiceGroup,
  DicePool,
  DicePools,
  skillSpecialtyBonus,
} from "../../UI/DicePool"
import { CharacterAttr } from "../CharacterAttr"
import { CharacterPoolTypes } from "../CharacterPoolTypes"
import { useActiveSkill } from "../CharacterProvider"

export const DicePoolsSection: FC = () => {
  return (
    <DicePools>
      <DodgePool />
      <ResistDamagePool />
      <ComposurePool />
      <JudgeIntentPool />
      <MemoryPool />
      <LiftPool />
      <FirstAidPool />
      <MedkitPool />
    </DicePools>
  )
}

const DodgePool: FC = () => (
  <DicePool
    poolKey={CharacterPoolTypes.dodge}
    name={"Dodge"}
    attrs={[CharacterAttr.reaction, CharacterAttr.intuition]}
    dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
  />
)

const ResistDamagePool: FC = () => (
  <DicePool
    poolKey={CharacterPoolTypes.dmgResist}
    name={"Resist Dmg."}
    attrs={[CharacterAttr.body]}
    dmgPenaltyTypes={[]}
  />
)

const ComposurePool: FC = () => (
  <DicePool
    poolKey={CharacterPoolTypes.composure}
    name={"Composure"}
    attrs={[CharacterAttr.willpower, CharacterAttr.charisma]}
    dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
  />
)

const JudgeIntentPool: FC = () => (
  <DicePool
    poolKey={CharacterPoolTypes.judgeIntent}
    name={"Judge Intent"}
    attrs={[CharacterAttr.willpower, CharacterAttr.intuition]}
    dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
  />
)

const MemoryPool: FC = () => (
  <DicePool
    poolKey={CharacterPoolTypes.memory}
    name={"Memory"}
    attrs={[CharacterAttr.logic, CharacterAttr.intuition]}
    dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
  />
)

const LiftPool: FC = () => (
  <DicePool
    poolKey={CharacterPoolTypes.liftCarry}
    name={"Lift/Carry"}
    attrs={[CharacterAttr.body, CharacterAttr.strength]}
    dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
  />
)

const FirstAidPool: FC = () => {
  const firstAidKit = useAllGear().find((gear) => gear.kit === KitType.firstAid)
  const biotechSkill = useActiveSkill(ActiveSkillIds.CRB.biotech)
  if (!biotechSkill) return null

  const bonuses: DiceGroup[] = []
  const specialtyBonus = skillSpecialtyBonus(biotechSkill, "First Aid")
  if (specialtyBonus) bonuses.push(specialtyBonus)
  if (!firstAidKit) bonuses.push({ name: "Kit", size: -2 })

  return (
    <DicePool
      poolKey={CharacterPoolTypes.firstAid}
      name={"First Aid"}
      skills={[ActiveSkillIds.CRB.biotech]}
      attrs={[CharacterAttr.logic]}
      bonuses={bonuses}
      dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
    />
  )
}

const MedkitPool: FC = () => {
  const biotechSkill = useActiveSkill(ActiveSkillIds.CRB.biotech)
  const medKit = useAllGear().find((gear) => gear.kit === KitType.medKit) as
    | OtherGearData
    | undefined

  if (!biotechSkill) return null
  if (!medKit) return null

  const bonuses: DiceGroup[] = []
  if (medKit.attributes && medKit.attributes[KitAttr.medkitRating])
    bonuses.push({
      name: "Medkit",
      size: (medKit.attributes[KitAttr.medkitRating] as number) || 0,
    })

  return (
    <DicePool
      poolKey={CharacterPoolTypes.firstAid}
      name={"MedKit"}
      skills={[ActiveSkillIds.CRB.biotech]}
      attrs={[CharacterAttr.logic]}
      bonuses={bonuses}
      dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
    />
  )
}
