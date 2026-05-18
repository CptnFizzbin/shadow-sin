import jsYaml from "js-yaml"

import type { JsonValue } from "#/lib/jsonUtils.ts"
import { toJsonValue } from "#/lib/jsonUtils.ts"
import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"
import type { GameConfig } from "#/system/gameConfig.ts"

const GAME_CONFIG_STORAGE_KEY = "game-config"

/**
 * Serialise a {@link GameConfig} to a YAML string. Mirrors the pattern in
 * `exportUtils.ts` but without a migration pipeline — GameConfig is a
 * simpler, future-proof stub.
 */
export function gameConfigToYaml(config: GameConfig): string {
  return jsYaml.dump(config, { lineWidth: 120 })
}

/**
 * Parse a YAML string into a {@link GameConfig}. The caller is responsible
 * for any further validation; this helper does not run migrations.
 */
export function yamlToGameConfig(yamlContent: string): GameConfig {
  return jsYaml.load(yamlContent) as GameConfig
}

/**
 * Read the persisted {@link GameConfig} from the given storage, or `null`
 * if none has been saved.
 */
export async function loadGameConfig(
  storage: AsyncJsonStorage,
): Promise<GameConfig | null> {
  const raw = await storage.getItem<JsonValue>(GAME_CONFIG_STORAGE_KEY)
  return raw === null ? null : (raw as unknown as GameConfig)
}

/**
 * Persist a {@link GameConfig} to the given storage at the well-known
 * `game-config` key.
 */
export async function saveGameConfig(
  storage: AsyncJsonStorage,
  config: GameConfig,
): Promise<void> {
  await storage.setItem(GAME_CONFIG_STORAGE_KEY, toJsonValue(config))
}
