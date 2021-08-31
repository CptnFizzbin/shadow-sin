class ApplicationController < ActionController::API
  def current_user
    return @user ||= User.find_by!(headers["API_TOKEN"])
  end
end
