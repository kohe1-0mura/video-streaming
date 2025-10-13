import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
          動画ストリーミングサービス
        </h1>
        
        <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
          <Link
            href="/upload"
            style={{
              padding: "15px 30px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: "bold"
            }}
          >
            ffmpeg で変換
          </Link>
          <Link
            href="/upload-aws"
            style={{
              padding: "15px 30px",
              backgroundColor: "#ff9800",
              color: "white",
              textDecoration: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: "bold"
            }}
          >
            mediaconvert で変換
          </Link>
          <Link
            href="/videos"
            style={{
              padding: "15px 30px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: "bold"
            }}
          >
            動画一覧
          </Link>
        </div>

      </main>
    </div>
  );
}
