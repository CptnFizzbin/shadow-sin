import { nextRecordId } from '../../Api/Model'

import { Migration, SavedCharacterData } from './index'

interface InputData extends SavedCharacterData {
  nuyen: number
  karma: number
}

interface OutputData extends SavedCharacterData {
  nuyen: BalanceEntry[]
}

interface BalanceEntry {
  id: string
  date: string
  note: string
  value: number
}

export const BalanceLogsMigration: Migration = {
  version: 3,

  run: (character: InputData): OutputData => {
    const nuyen: BalanceEntry[] = [
      {
        id: nextRecordId(),
        date: new Date().toISOString(),
        note: 'Import balance',
        value: character.nuyen,
      },
    ]

    const karma: BalanceEntry[] = [
      {
        id: nextRecordId(),
        date: new Date().toISOString(),
        note: 'Import balance',
        value: character.karma,
      },
    ]

    return { ...character, nuyen, karma }
  },
}
