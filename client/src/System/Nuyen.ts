import { parseISO } from 'date-fns'

import { useCharacter } from '../Character/CharacterProvider'

const nuyenFormatter = new Intl.NumberFormat('en')
export const formatNuyen = (cost: number): string => {
  return nuyenFormatter.format(cost) + ' ¥'
}

export const useNuyenBalance = (): number => {
  const character = useCharacter()
  if (!character) return 0

  return character.nuyen
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .reduce((sum, entry) => sum + entry.value, 0)
}
