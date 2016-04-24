class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :login_id, :unique => true, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :photo_url, null: false
      t.string :email, null: false
      t.integer :games_created, default: 0
      t.integer :games_completed, default: 0
      t.string :remember_token
      t.string :password_digest, null: false

      t.timestamps null: false
    end
  end
end
