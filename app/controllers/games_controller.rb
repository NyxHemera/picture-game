class GamesController < ApplicationController
  before_action :signed_in_user

  def index
    @games = Game.all
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @game }
    end
  end

  def new
    @game = Game.new
  end

  def edit
  end

  def create
    @game = Game.new(game_params)
    @game.users.push(current_user)
    @game.stories.push(params[:game][:stories])
    respond_to do |format|
      if @game.save
        format.html { redirect_to games_path, notice: 'Welcome!' }
        #format.json { render :show, status: :created, location: @game }
      else
        format.html { render :new }
        #format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to @game, notice: 'Game was successfully updated.' }
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
        :draw_urls)
    end
end
