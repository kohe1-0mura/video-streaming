# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  # 環境変数 CORS_ORIGINS にカンマ区切りで許可Originを指定（例: "http://localhost:3001,https://video-streaming-psi.vercel.app"）
  allowed = ENV.fetch("CORS_ORIGINS", "http://localhost:3001").split(",").map(&:strip)

  allow do
    origins(*allowed)

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
