# frozen_string_literal: true

class StatusController < ApplicationController
  skip_before_action :authenticate

  def status
    render json: { status: 'alive', time: Time.zone.now }
  end
end
