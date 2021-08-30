class UserController < ApplicationController
  def index
    render json: {
      count: User.count,
      users: User.all,
    }
  end

  def view
    user = User.find_by_id(params[:id])

    if user
      render json: {
        user: user,
      }
    else
      render json: { msg: "User not found" }, status: :not_found
    end
  end
end
