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

ActiveRecord::Schema.define(version: 20160421143510) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.boolean  "text_last"
    t.string   "draw_urls",  default: [],              array: true
    t.string   "stories",    default: [],              array: true
    t.boolean  "finished"
    t.integer  "num_rounds"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "join_user_games", force: :cascade do |t|
    t.string "user"
    t.string "game"
  end

  create_table "users", force: :cascade do |t|
    t.string   "login_id",        null: false
    t.string   "first_name",      null: false
    t.string   "last_name",       null: false
    t.string   "photo_url"
    t.string   "email",           null: false
    t.integer  "games_created"
    t.integer  "games_completed"
    t.string   "remember_token"
    t.string   "password_digest", null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

end
