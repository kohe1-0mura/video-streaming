export type Video = { id: number; thumbnail_url: string; stream_url: string };

export async function fetchVideos(): Promise<Video[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('fetch error');
  return res.json();
}