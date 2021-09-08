class AuthToken
  TOKEN_KEY = ENV["SERVER_TOKEN_KEY"]
  ALGORITHM = 'HS256'
  TOKEN_TIMEOUT = 1.hour

  def self.create(user)
    payload = {
      "usr" => user.id,
      "exp" => Time.now.to_i + TOKEN_TIMEOUT
    }

    return JWT.encode(payload, TOKEN_KEY, ALGORITHM)
  end

  def self.decode(token)
    payload, _ = JWT.decode(token, TOKEN_KEY, true, algorithm: ALGORITHM)
    return payload
  end

  def self.user(token)
    return User.find_by!(id: self.decode(token)["usr"])
  end
end
