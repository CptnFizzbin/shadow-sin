import { CharacterManager } from "#/lib/storage/characters/CharacterManager.ts";
import { LocalStorageProvider } from "#/lib/storage/local-storage/LocalStorageProvider.ts";
import { StorageManager } from "#/lib/storage/StorageManager.ts";

export { CharacterManager } from "#/lib/storage/characters/CharacterManager.ts";
export type {
  IStorageProvider,
  StoredJsonFile,
  StoredJsonFileMetadata,
} from "#/lib/storage/IStorageProvider.ts";
export { LocalStorageProvider } from "#/lib/storage/local-storage/LocalStorageProvider.ts";
export { StorageManager } from "#/lib/storage/StorageManager.ts";

export const storageManager = new StorageManager(
  new LocalStorageProvider({
    storagePrefix: "shadow-sin",
  }),
);

export const characterManager = new CharacterManager(storageManager);
