class ApplicationController < ActionController::API
  include ActionController::Cookies

  before_action :authenticate
  rescue_from StandardError, with: :server_error
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def current_user
    @current_user ||= session[:user_id] ? User.find_by(id: session[:user_id]) : nil
  end

  def current_user=(user)
    @current_user = user
    session[:user_id] = user&.id
  end

  def authenticate
    self.render_error status: 401, type: 'UNAUTHORIZED', message: "Not Authorized" if !self.current_user
  end

  def server_error(exception)
    Rails.logger.error(exception)
    Rails.logger.error(exception.backtrace.join("\n"))
    self.render_error status: 500, exception: exception
  end

  def record_not_found(exception)
    self.render_error status: 404, exception: exception
  end

  def render_error(status:, message: nil, type: nil, exception: nil)
    message ||= exception&.message
    raise ArgumentError "Error Message is missing" if !message

    type ||= exception&.class&.name
    raise ArgumentError "Error Type is missing" if !type

    render json: { err: type, msg: message }, status: status
  end
end
