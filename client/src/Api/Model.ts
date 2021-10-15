import * as uuid from 'uuid'

export type RecordId = string | null;
export type IsoDateString = string;

export function nextRecordId (): string {
  return uuid.v4()
}

export interface Model {
  id: RecordId
  createdAt: IsoDateString
  updatedAt: IsoDateString
}
