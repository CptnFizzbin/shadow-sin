class Initial < ActiveRecord::Migration[6.1]
  def change
    enable_extension 'pgcrypto'

    create_table :users, id: :uuid do |t|
      t.string :username

      t.timestamps
    end

    create_table :characters, id: :uuid do |t|
      t.belongs_to :user, foreign_key: true

      t.string :name
      t.json :data

      t.timestamps
    end

    create_table :gear, id: :uuid do |t|
      t.belongs_to :character, foreign_key: true
      t.belongs_to :gear, foreign_key: true

      t.string :name
      t.json :data

      t.timestamps
    end
  end
end
