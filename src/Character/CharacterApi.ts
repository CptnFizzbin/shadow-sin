import { RecordId } from '../Api/Model'
import { ServerApi } from '../Api/ServerApi'
import { Character, SimpleCharacter } from './Character'

export class CharacterApi {
  static list (): Promise<SimpleCharacter[]> {
    return ServerApi.get<SimpleCharacter[]>('/characters')
  }

  static fetch (characterId: RecordId): Promise<Character> {
    return ServerApi.get<Character>(`/characters/${characterId}`)
  }

  static create (character: Character): Promise<Character> {
    return ServerApi.post<Character>('/characters', character)
  }

  static update (character: Character): Promise<Character> {
    return ServerApi.post<Character>(`/characters/${character.id}`, character)
  }

  static save (character: Character): Promise<Character> {
    return character.id ? this.update(character) : this.create(character)
  }
}
