class UserController < ApplicationController
  def view
    render json: { user: current_user }
  end
end
