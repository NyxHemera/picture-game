class StaticPagesController < ApplicationController
  def home
  	if signed_in?
  		redirect_to users_path
  	end
  end

  def about
  end
end
