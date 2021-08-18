import { AugmentData } from './AugmentData'

export interface HeadwearData extends AugmentData {
  type: string
}

export enum HeadwearTypes {
  commlink = 'aug.headwear.commlink',
  controlRig = 'aug.headwear.controlRig',
  cortexBomb = 'aug.headwear.cortexBomb',
  cyberdeck = 'aug.headwear.cyberdeck',
  datajack = 'aug.headwear.datajack',
  datalock = 'aug.headwear.datalock',
  olfactoryBooster = 'aug.headwear.olfactoryBooster',
  simrig = 'aug.headwear.simrig',
}
