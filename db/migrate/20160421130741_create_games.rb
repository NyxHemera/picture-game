class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.boolean :text_last
      t.string :draw_urls, array: true, default: []
      t.string :stories, array: true, default: []
      t.boolean :finished
      t.integer :num_rounds

      t.timestamps null: false
    end
  end
end
