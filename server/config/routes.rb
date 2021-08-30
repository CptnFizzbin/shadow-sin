Rails.application.routes.draw do
  get 'user/:id', to: 'user#view'
  post 'user/:id', to: 'user#update'

  get 'user', to: 'user#index'
end
