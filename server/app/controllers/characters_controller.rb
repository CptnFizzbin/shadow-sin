class CharactersController < ApplicationController
  def index
    characters = Character.where(:user => current_user)
    render json: { count: characters.count, characters: characters.all }
  end

  def show
    character = Character
      .where(:user => current_user, :id => params[:id]).includes(:gear).first!
    render json: character.as_json(include: :gear)
  end

  def create
    character = Character.new(character_params)
    character.user = current_user
    character.save!
    render json: character
  end

  def update
    character = Character.where(:user => current_user, :id => params[:id]).first!
    character.update(character_params)
    character.save!
    render json: character
  end

  def destroy
    character = Character.where(:user => current_user, :id => params[:id]).first!
    character.destroy!
    render json: character
  end

  def character_params
    return params.require(:character).permit(:name, data: { })
  end
end
