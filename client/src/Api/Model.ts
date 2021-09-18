import * as uuid from 'uuid'

export type RecordId = string | null;

export function nextRecordId (): string {
  return uuid.v4()
}

export interface Model {
  id: RecordId
  created_at: string
  updated_at: string
}
