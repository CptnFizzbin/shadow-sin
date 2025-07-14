import { createContext, FC, useContext, useEffect, useState } from "react"

import { RecordId } from "../../Api/Model"
import { noOp } from "../../Helpers"
import { DamageType } from "./DamageType"

type DamageSetter = (value: number) => void

type DamageContextData = {
  [type in DamageType]?: {
    value: number
    setValue?: DamageSetter
  }
}

const DamageContext = createContext<DamageContextData>({})

interface DamageProviderProps {
  type: DamageType
  id: RecordId
}

export const DamageProvider: FC<DamageProviderProps> = ({
  type,
  id,
  children,
}) => {
  const dmgSessionKey = `dmg.${id}.${type}`
  const [value, setDmgValue] = useState<number>(0)

  useEffect(() => {
    const value = parseInt(localStorage.getItem(dmgSessionKey) || "0")
    setDmgValue(value)
  }, [dmgSessionKey])

  const onDmgChange = (value: number) => {
    setDmgValue(value)
    localStorage.setItem(dmgSessionKey, value.toString())
  }

  const damages: DamageContextData = {
    ...useContext(DamageContext),
    [type]: { value, setValue: onDmgChange },
  }

  return (
    <DamageContext.Provider value={damages}>{children}</DamageContext.Provider>
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
    .map((type) => damageData[type]?.value || 0)
    .map((value) => Math.floor(value / 3))
    .reduce((a, b) => a + b, 0)
}
