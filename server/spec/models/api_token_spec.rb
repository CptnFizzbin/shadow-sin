# == Schema Information
#
# Table name: api_tokens
#
# @!attribute id
#   @return []
# @!attribute token
#   @return [String]
# @!attribute created_at
#   @return [Time]
# @!attribute updated_at
#   @return [Time]
# @!attribute user_id
#   @return [String]
#
# Indexes
#
#  index_api_tokens_on_token    (token)
#  index_api_tokens_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe ApiToken, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
