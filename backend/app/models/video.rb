class Video < ApplicationRecord
  extend Enumerize

  enumerize :status, in: { uploading: 0, processing: 1, ready: 2, failed: 3 }

  has_one_attached :file
  has_one_attached :thumbnail

  def hls_url
    gid  = group_id.presence || id.to_s
    base = ENV["HLS_BASE_URL"].presence || "https://#{ENV.fetch("OUTPUT_BUCKET")}.s3.amazonaws.com"
    "#{base}/videos/#{gid}/hls/master.m3u8"
  end
end