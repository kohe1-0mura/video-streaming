import Image from 'next/image';
import Link from 'next/link';
import { fetchVideos } from './components/fetchVideos';

export default async function VideoList() {
  const videos = await fetchVideos();
  return (
    <ul className="grid grid-cols-2 gap-4 p-6">
      {videos.map(v => (
        <li key={v.id}>
          <Link href={`/videos/${v.id}`}>
            <Image src={v.thumbnail_url} alt="" width={320} height={180} className="rounded-xl" />
          </Link>
        </li>
      ))}
    </ul>
  );
}