import {BalanceLog} from '../../System/BalanceLog'

interface Party {
  nuyen: BalanceLog
}

export const LuckyDogs: Party = {
  'nuyen': [
    {
      date: '2021-12-19T16:00',
      value: 40_000,
      note: 'Mission Rewards',
    },
  ],
}
