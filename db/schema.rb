# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160423205857) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.boolean  "text_last",  default: false
    t.string   "draw_urls",  default: [],                 array: true
    t.string   "stories",    default: [],                 array: true
    t.boolean  "finished",   default: false
    t.integer  "num_rounds", default: 3
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "games_users", id: false, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "game_id", null: false
  end

  add_index "games_users", ["game_id", "user_id"], name: "index_games_users_on_game_id_and_user_id", using: :btree
  add_index "games_users", ["user_id", "game_id"], name: "index_games_users_on_user_id_and_game_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "login_id",                    null: false
    t.string   "first_name",                  null: false
    t.string   "last_name",                   null: false
    t.string   "photo_url",                   null: false
    t.string   "email",                       null: false
    t.integer  "games_created",   default: 0
    t.integer  "games_completed", default: 0
    t.string   "remember_token"
    t.string   "password_digest",             null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

end
