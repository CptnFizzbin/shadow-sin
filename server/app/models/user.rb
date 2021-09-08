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
class User < ApplicationRecord
  has_many :characters

  validates_presence_of :username
end
