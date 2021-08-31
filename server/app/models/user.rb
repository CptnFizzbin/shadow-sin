class User < ApplicationRecord
  has_many :characters

  validates_presence_of :username
end
