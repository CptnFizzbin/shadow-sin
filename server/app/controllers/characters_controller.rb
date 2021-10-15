class CharactersController < ApplicationController
  def index
    characters = Character.where(user: current_user)

    render json: characters.all.map { |char|
      {
        id: char.id,
        name: char.data[:name],
        updated_at: char.updated_at,
      }
    }
  end

  def show
    character = Character
      .where(user: current_user, id: params[:id])
      .first!

    render json: character
  end

  def create
    character = Character.new(data: params[:data])

    character.user = current_user
    character.save!

    render json: character
  end

  def update
    character = Character
      .where(user: current_user, id: params[:id])
      .first!

    character.data = params[:data]
    character.save!

    render json: character
  end

  def destroy
    character = Character
      .where(user: current_user, id: params[:id])
      .first!

    character.destroy!

    render json: character
  end
end
