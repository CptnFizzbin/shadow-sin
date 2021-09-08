class CreateApiTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :api_tokens, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, foreign_key: true
      t.uuid :token, index: true, unique: true, default: "gen_random_uuid()"

      t.timestamps
    end
  end
end
