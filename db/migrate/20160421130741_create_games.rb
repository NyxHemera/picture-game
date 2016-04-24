class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.boolean :text_last, default: false
      t.string :draw_urls, array: true, default: []
      t.string :stories, array: true, default: []
      t.boolean :finished, default: false
      t.integer :num_rounds, default: 3

      t.timestamps null: false
    end
  end
end
