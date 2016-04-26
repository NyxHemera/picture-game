# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create!(login_id: 'testuser1', first_name: 'Alex', last_name: 'Tester', photo_url: 'http://tamarateneta.com/wp-content/uploads/2013/04/sq5.jpg', email: 'test1@email.com', password_digest: BCrypt::Password.create('Password12'))
User.create!(login_id: 'testuser2', first_name: 'Jane', last_name: 'Tester', photo_url: 'http://www.getparade.com/media/imagic/square3.jpg', email: 'test2@email.com', password_digest: BCrypt::Password.create('Password12'))
User.create!(login_id: 'testuser3', first_name: 'Lily', last_name: 'Tester', photo_url: 'http://www.lightstalking.com/wp-content/uploads/2010/02/square.jpg', email: 'test3@email.com', password_digest: BCrypt::Password.create('Password12'))
User.create!(login_id: 'testuser4', first_name: 'Jack', last_name: 'Tester', photo_url: 'http://www.ventedspleen.com/simon_portrait_square2.jpg', email: 'test4@email.com', password_digest: BCrypt::Password.create('Password12'))