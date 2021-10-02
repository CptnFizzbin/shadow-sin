# frozen_string_literal: true

class AuthController < ApplicationController
  skip_before_action :authenticate

  def login
    self.logout

    user = User
      .find_by(username: params[:username].downcase)
      &.authenticate(params[:password])

    return self.render_error(status: :bad_request, type: 'AuthError', message: 'Invalid Login') if !user

    self.current_user = user
    render json: { user: self.current_user }
  end

  def logout
    self.current_user = nil
  end
end
