# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users', type: :request do
  describe 'GET /user' do
    let(:users) do
      [
        User.new({ username: 'User 1' }),
        User.new({ username: 'User 2' }),
        User.new({ username: 'User 3' })
      ]
    end

    before { users.each(&:save) }

    it 'returns http success' do
      get '/user'

      expect(response).to have_http_status(:success)
    end

    it 'contains count of records' do
      get '/user'

      body = JSON.parse(response.body)
      expect(body['count']).to eq(users.size)
    end

    it 'contains list of all users' do
      get '/user'

      body = JSON.parse(response.body)
      usernames = body['users'].map { |user| user['username'] }
      users.each { |user| expect(usernames).to include(user.username) }
    end

    context 'when there are no users' do
      let(:users) { [] }

      it 'returns success' do
        get '/user'

        expect(response).to have_http_status(:success)

        body = JSON.parse(response.body)
        expect(body['count']).to eq(0)
        expect(body['users']).to eq([])
      end
    end
  end

  describe 'GET /user/:id' do
    let(:user) { User.create({ username: 'User' }) }

    it 'returns http success' do
      get "/user/#{user.id}"

      expect(response).to have_http_status(:success)
    end

    context 'when user does not exist' do
      it 'returns 404' do
        get '/user/null-user'

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
