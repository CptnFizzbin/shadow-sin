import {GearData} from '../../Gear/GearData'
import {BalanceLog} from '../../System/BalanceLog'

interface Party {
  nuyen: BalanceLog
  gear: GearData[]
}

export const LuckyDogs: Party = {
  'nuyen': [
    {
      date: '2021-12-19T16:00',
      value: 40_000,
      note: 'Mission Rewards',
    },
  ],

  gear: [],
}
