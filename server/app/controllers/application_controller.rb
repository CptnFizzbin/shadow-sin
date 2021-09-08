class ApplicationController < ActionController::API
  attr_accessor :current_user

  before_action :authenticate
  rescue_from StandardError, with: :server_error
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def authenticate
    if !@current_user
      auth_type, auth_token = request.env['HTTP_AUTHORIZATION'].split(" ")

      if auth_type != "Bearer"
        render json: { error: "Authorization header must be 'Bearer'" }, status: 404
        return false
      end

      @current_user = AuthToken.user(auth_token)
    end
  end

  def server_error(exception)
    render json: {
      error: {
        status: 500,
        type: exception.class.name,
        message: exception.message
      }
    }, status: 500
  end

  def record_not_found(exception)
    render json: {
      error: {
        status: 404,
        message: exception.message
      }
    }, status: 404
  end
end
