import { createContext, FC, useContext } from 'react'

import { noOp } from '../../Helpers'
import { DamageType } from './DamageType'

type DamageSetter = (value: number) => void;

type DamageContextData = {
  [type in DamageType]?: {
    value: number
    setValue?: DamageSetter
  };
};

const DamageContext = createContext<DamageContextData>({})

interface DamageProviderProps {
  type: DamageType
  value: number

  onChange? (value: number): void
}

export const DamageProvider: FC<DamageProviderProps> = ({
  type,
  value,
  onChange = noOp,
  children,
}) => {
  const damages: DamageContextData = {
    ...useContext(DamageContext),
    [type]: { value, setValue: onChange },
  }

  return (
    <DamageContext.Provider value={damages}>
      {children}
    </DamageContext.Provider>
  )
}

export const useDamage = (type: DamageType): number => {
  return useContext(DamageContext)[type]?.value || 0
}

export const useSetDamage = (type: DamageType): DamageSetter => {
  return useContext(DamageContext)[type]?.setValue || noOp
}

export const useDamagePenalty = (types: DamageType[]): number => {
  const damageData = useContext(DamageContext)

  return types
    .map(type => damageData[type]?.value || 0)
    .map(value => Math.floor(value / 3))
    .reduce((a, b) => a + b, 0)
}
