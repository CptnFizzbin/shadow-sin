class Initial < ActiveRecord::Migration[6.1]
  def change
    enable_extension 'pgcrypto'

    create_table :users, id: :uuid do |t|
      t.string :username, nil: false, unique: true
      t.string :password_digest, nil: false
      t.timestamps
    end

    create_table :characters, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, foreign_key: true
      t.json :data
      t.timestamps
    end
  end
end
