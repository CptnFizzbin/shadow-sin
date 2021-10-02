require 'rails_helper'

RSpec.describe "Characters", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/characters/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /view" do
    it "returns http success" do
      get "/characters/view"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/characters/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/characters/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/characters/delete"
      expect(response).to have_http_status(:success)
    end
  end
end
