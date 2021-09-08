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
  has_secure_password

  has_many :characters

  validates_presence_of :username
  validates_uniqueness_of :username, case_sensitive: false

  before_save { self.username = username.downcase }
end
