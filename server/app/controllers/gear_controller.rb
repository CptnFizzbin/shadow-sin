class GearController < ApplicationController
  def index
  end

  def view
  end

  def create
  end

  def update
  end

  def delete
  end

  def gear_params
    return params.require(:gear).permit(:name, data: { })
  end
end
