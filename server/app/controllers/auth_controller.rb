class AuthController < ApplicationController
  skip_before_action :authenticate

  def login
    user = User
      .find_by(username: params[:username])
      &.authenticate(params[:password])

    raise ActiveRecord::RecordNotFound, "User not found" if !user

    render json: { "authToken": AuthToken.create(user) }
  end
end
