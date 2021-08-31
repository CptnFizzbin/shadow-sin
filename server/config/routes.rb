Rails.application.routes.draw do
  get 'user', to: 'user#view'
  patch 'user', to: 'user#update'

  resources :characters
end
