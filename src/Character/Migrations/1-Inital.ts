import { Migration } from './index'

export const InitialMigration: Migration = {
  version: 1,
  run: (character) => character,
}
