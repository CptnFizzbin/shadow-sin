export class CharacterNotFoundError extends Error {
  public constructor(id: string) {
    super(`Character not found: ${id}`)
    this.name = "CharacterNotFoundError"
  }
}
