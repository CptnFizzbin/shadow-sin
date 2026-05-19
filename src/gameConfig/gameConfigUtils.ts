import jsYaml from "js-yaml"

import { toJsonValue } from "#/lib/jsonUtils.ts"
import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"
import type { GameConfig } from "#/system/gameConfig.ts"
import { GameConfigSchema } from "#/system/gameConfig.ts"

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
 * Parse a YAML string into a {@link GameConfig}, validating against
 * {@link GameConfigSchema}. Throws if the YAML is malformed or fails
 * schema validation.
 */
export function yamlToGameConfig(yamlContent: string): GameConfig {
  return GameConfigSchema.parse(jsYaml.load(yamlContent))
}

/**
 * Read the persisted {@link GameConfig} from the given storage, or `null`
 * if none has been saved. Validates the loaded value against
 * {@link GameConfigSchema}; throws if storage contains a malformed record.
 */
export async function loadGameConfig(
  storage: AsyncJsonStorage,
): Promise<GameConfig | null> {
  const raw = await storage.getItem(GAME_CONFIG_STORAGE_KEY)
  return raw === null ? null : GameConfigSchema.parse(raw)
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
