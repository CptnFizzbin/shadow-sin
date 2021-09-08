# == Schema Information
#
# Table name: users
#
# @!attribute id
#   @return [String]
# @!attribute username
#   @return [String]
# @!attribute created_at
#   @return [Time]
# @!attribute updated_at
#   @return [Time]
#
require 'rails_helper'

RSpec.describe User, type: :model do
  it { is_expected.to respond_to(:username) }
end
