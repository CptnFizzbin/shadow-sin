import { GearData } from '../../Gear/GearData'
import { BalanceLog } from '../../System/BalanceLog'
import { Artemis } from '../Characters/Artemis'
import { Dusk } from '../Characters/Dusk'
import { Silicus } from '../Characters/Silicus'
import { Spike } from '../Characters/Spike'
import { Xendris } from '../Characters/Xendris'

interface Party {
  characterIds: string[]
  nuyen: BalanceLog
  gear: GearData[]
}

export const LuckyDogs: Party = {
  characterIds: [
    Artemis.bio.name,
    Silicus.bio.name,
    Spike.bio.name,
    Xendris.bio.name,
    Dusk.bio.name,
  ],

  nuyen: [
    {
      date: '2021-12-19T16:00',
      value: 40_000,
      note: 'Mission Rewards',
    },
  ],

  gear: [],
}
