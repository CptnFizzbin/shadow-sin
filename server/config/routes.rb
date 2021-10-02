Rails.application.routes.draw do
  root to: 'status#status'

  post '/signup', to: 'auth#sign_up'
  post '/login', to: 'auth#login'
  post '/logout', to: 'auth#logout'

  get '/user', to: 'user#view'
  patch '/user', to: 'user#update'

  resources :characters
  resources :gear
end
