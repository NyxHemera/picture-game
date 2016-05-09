class GamesController < ApplicationController
  before_action :signed_in_user

  def index
    @games = Game.all
  end

  def show
    @game = Game.find(params[:id])
#    respond_to do |format|
#      format.html
#      format.json { render json: @game }
#    end
  end

  def new
    @game = Game.new
  end

  def edit
    @game = Game.find(params[:id])
    @played = false
    @game.users.each do |user|
      if current_user == user
        @played = true
      end
    end
  end

  def create
    @game = Game.new(game_params)
    @game.users.push(current_user)
    @game.stories.push(params[:game][:stories])
    @game.num_rounds = params[:game][:num_rounds]
    @game.text_last = !@game.text_last
    current_user.games_created += 1;
    current_user.save(validate: false)
    respond_to do |format|
      if @game.save(validate: false)
        format.html { redirect_to games_path, notice: 'Welcome!' }
        #format.json { render :show, status: :created, location: @game }
      else
        format.html { redirect_to new_game_path }
        #format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @game = Game.find(params[:id])
    @game.users.push(current_user)
    if @game.text_last
      @game.draw_urls.push(params[:game][:image])
    else
      @game.stories.push(params[:game][:stories])
    end
    @game.text_last = !@game.text_last

    if @game.num_rounds <= (@game.stories.length + @game.draw_urls.length)
      @game.finished = true
      @game.users.each do |user|
        user.games_completed += 1
        user.save
      end
    end
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to games_path, notice: 'Game was successfully updated.' }
        #format.json { render :show, status: :ok, location: @game }
      else
        format.html { render :edit }
        #format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @game.destroy
    respond_to do |format|
      format.html { redirect_to games_url, notice: 'Game was successfully destroyed.' }
      #format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_params
      params.require(:game).permit(
        :stories,
        :draw_urls,
        :num_rounds)
    end
end
