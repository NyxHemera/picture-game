Rails.application.routes.draw do
  root to: 'static_pages#home'
  match '/about', to: 'static_pages#about', via: 'get'
  
  get 'static_pages/home'

  get 'static_pages/about'

  resources :sessions, only:[:new, :create, :destroy]
  resources :users
  resources :games

  match '/signup',  to: 'users#new',            via: 'get'
  match '/signin',  to: 'sessions#new',         via: 'get'
  match '/signout', to: 'sessions#destroy',     via: 'delete'

end
