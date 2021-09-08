require 'rails_helper'

RSpec.describe "Gear", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/gear/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /view" do
    it "returns http success" do
      get "/gear/view"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/gear/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/gear/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /delete" do
    it "returns http success" do
      get "/gear/delete"
      expect(response).to have_http_status(:success)
    end
  end

end
