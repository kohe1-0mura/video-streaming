import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { MediaConvertClient, CreateJobCommand } from "@aws-sdk/client-mediaconvert";

const REGION = "ap-northeast-1";
const s3 = new S3Client({ region: REGION });
const mc = new MediaConvertClient({ region: REGION });

const VIDEO_EXT = [".mp4", ".mov", ".m4v", ".mkv"];

export const handler = async (event) => {
  for (const record of event.Records ?? []) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    if (!VIDEO_EXT.some(ext => key.toLowerCase().endsWith(ext))) continue;

    const m = key.match(/^videos\/mc\/([^/]+)\/(?!hls\/).+$/);
    if (!m) continue;
    const videoId = m[1];

    const masterKey = `videos/mc/${videoId}/hls/master.m3u8`;
    try {
      await s3.send(new HeadObjectCommand({ Bucket: process.env.OUTPUT_BUCKET, Key: masterKey }));
      continue;
    } catch {}

    const inputUrl = `s3://${bucket}/${key}`;
    const destination = `s3://${process.env.OUTPUT_BUCKET}/videos/mc/${videoId}/hls/`;

    const params = process.env.JOB_TEMPLATE_ARN
      ? {
          Role: process.env.MC_ROLE_ARN,
          JobTemplate: process.env.JOB_TEMPLATE_ARN,
          Settings: {
            Inputs: [{
              FileInput: inputUrl,
              AudioSelectors: {
                "Audio Selector 1": { DefaultSelection: "DEFAULT" }
              }
            }],
            OutputGroups: [
              {
                OutputGroupSettings: {
                  Type: "HLS_GROUP_SETTINGS",
                  HlsGroupSettings: { Destination: destination }
                }
              }
            ]
          },
          UserMetadata: { videoId }
        }
      : {
          Role: process.env.MC_ROLE_ARN,
          Settings: {
            Inputs: [{
              FileInput: inputUrl,
              AudioSelectors: {
                "Audio Selector 1": { DefaultSelection: "DEFAULT" }
              }
            }],
            OutputGroups: [
              {
                Name: "Apple HLS",
                OutputGroupSettings: {
                  Type: "HLS_GROUP_SETTINGS",
                  HlsGroupSettings: {
                    Destination: destination,
                    SegmentLength: 6,
                    MinSegmentLength: 0,
                    DirectoryStructure: "SINGLE_DIRECTORY",
                    ManifestCompression: "NONE",
                    OutputSelection: "MANIFESTS_AND_SEGMENTS"
                  }
                },
                Outputs: [
                  {
                    NameModifier: "_720",
                    VideoDescription: {
                      Width: 1280,
                      Height: 720,
                      CodecSettings: {
                        Codec: "H_264",
                        H264Settings: {
                          Bitrate: 3_500_000,
                          RateControlMode: "CBR",
                          GopSize: 48,
                          GopSizeUnits: "FRAMES",
                          FramerateControl: "INITIALIZE_FROM_SOURCE"
                        }
                      }
                    },
                    AudioDescriptions: [
                      {
                        AudioSourceName: "Audio Selector 1",
                        CodecSettings: {
                          Codec: "AAC",
                          AacSettings: {
                            Bitrate: 128_000,
                            CodingMode: "CODING_MODE_2_0",
                            SampleRate: 48_000
                          }
                        }
                      }
                    ],
                    ContainerSettings: { Container: "M3U8" }
                  }
                ]
              }
            ]
          },
          UserMetadata: { videoId }
        };

    await mc.send(new CreateJobCommand(params));
  }
  return { ok: true };
};
