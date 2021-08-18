import { AttributeData } from '../../System/Attribute'
import { AugmentData } from './AugmentData'

export interface HeadwearData extends AugmentData {
  type: string
}

export interface ControlRigData extends HeadwearData {
  type: HeadwearTypes.controlRig
  attributes: {
    grade: AttributeData<string>
    rating: AttributeData<number>
  }
}

export enum HeadwearTypes {
  commlink = 'commlink',
  controlRig = 'controlRig',
  cortexBomb = 'cortexBomb',
  cyberdeck = 'cyberdeck',
  datajack = 'datajack',
  datalock = 'datalock',
  olfactoryBooster = 'olfactoryBooster',
  simrig = 'simrig',
}
