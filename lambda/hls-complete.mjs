export const handler = async (event) => {
  const API_URL = process.env.API_URL;
  const MASTER_RE = /^videos\/(?:mc|rails)\/([^/]+)\/hls\/(.+)\.m3u8$/;
  const VARIANT_RE  = /_(\d{3,4}|audio|sub)\.m3u8$/;
  for (const rec of event.Records ?? []) {
    const key = decodeURIComponent(rec.s3.object.key.replace(/\+/g, " "));
    console.log("hls-complete event:", key)
    const m = key.match(MASTER_RE);
    
    if (!m) continue;
    if (VARIANT_RE.test(key)) continue; 

    const videoId = m[1];
    const res = await fetch(`${API_URL}/videos/${videoId}/hls_complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ master_key: key })
    });
    if (!res.ok) console.error("Webhook failed", res.status, await res.text());
  }
  return { ok: true };
};