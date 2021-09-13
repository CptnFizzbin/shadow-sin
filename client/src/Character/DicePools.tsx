import { FC } from 'react'

import { DamageType } from '../System/Damage/DamageType'
import { DicePool } from '../UI/DicePool'
import { CharacterAttr } from './CharacterAttr'

export enum CharacterPoolTypes {
  dodge = 'character.dodge',
  dmgResist = 'character.dmgResist',
  composure = 'character.composure',
  judgeIntent = 'character.judgeIntent',
  memory = 'character.memory',
  liftCarry = 'character.liftCarry',
}

export const DodgePool: FC = () => <DicePool
  key={CharacterPoolTypes.dodge}
  name={'Dodge'}
  attrs={[CharacterAttr.reaction, CharacterAttr.intuition]}
  dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
/>

export const ResistDamagePool: FC = () => <DicePool
  key={CharacterPoolTypes.dmgResist}
  name={'Resist Dmg.'}
  attrs={[CharacterAttr.body]}
  dmgPenaltyTypes={[]}
/>

export const ComposurePool: FC = () => <DicePool
  key={CharacterPoolTypes.composure}
  name={'Composure'}
  attrs={[CharacterAttr.willpower, CharacterAttr.charisma]}
  dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
/>

export const JudgeIntentPool: FC = () => <DicePool
  key={CharacterPoolTypes.judgeIntent}
  name={'Judge Intent'}
  attrs={[CharacterAttr.willpower, CharacterAttr.intuition]}
  dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
/>

export const MemoryPool: FC = () => <DicePool
  key={CharacterPoolTypes.memory}
  name={'Memory'}
  attrs={[CharacterAttr.logic, CharacterAttr.intuition]}
  dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
/>

export const LiftPool: FC = () => <DicePool
  key={CharacterPoolTypes.liftCarry}
  name={'Lift/Carry'}
  attrs={[CharacterAttr.body, CharacterAttr.strength]}
  dmgPenaltyTypes={[DamageType.charPhysical, DamageType.charStun]}
/>
