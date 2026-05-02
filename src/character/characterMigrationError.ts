export class CharacterMigrationError extends Error {
  public constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = "CharacterMigrationError"
  }
}
