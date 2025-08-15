class Video < ApplicationRecord
  extend Enumerize

  enumerize :status, in: { uploading: 0, processing: 1, ready: 2, failed: 3 }

  has_one_attached :file
  has_one_attached :thumbnail

  def hls_url
    key  = hls_master_key.presence
    base = ENV["HLS_BASE_URL"].presence || "https://#{ENV.fetch("AWS_BUCKET")}.s3.amazonaws.com"
    "#{base}/#{key}"
  end
end