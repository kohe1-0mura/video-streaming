"use client";

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Button
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Hls from "hls.js";

type Video = {
  id: number;
  title: string;
  created_at: string;
  thumbnail_url: string | null;
  hls_url: string | null;
  status: string;
};

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function VideoStreamPage() {
  const params = useParams();
  const videoId = params.id;
  const [video, setVideo] = useState<Video | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoId) return;
    
    fetch(`${API}/videos/${videoId}`)
      .then(res => res.json())
      .then(setVideo);
  }, [videoId]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !video?.hls_url) return;
    const hls = new Hls({ enableWorker: true });
    hls.loadSource(video.hls_url);
    hls.attachMedia(videoElement);
    return () => hls.destroy();
  }, [video]);

  if (!video) {
    return <Container maxW="container.lg" py={8}>読み込み中...</Container>;
  }

  const uploadDate = new Date(video.created_at).toLocaleDateString('sv-SE')

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button as={Link} href="/videos" leftIcon={<ChevronLeftIcon />} variant="ghost">
            動画一覧に戻る
          </Button>
        </HStack>

        <Box borderRadius="lg" overflow="hidden" bg="black">
          <video
            ref={videoRef}
            controls
            style={{ width: "100%", height: "100%" }}
          />
        </Box>

        <VStack align="start" spacing={4}>
          <VStack align="start" spacing={2}>
            <Heading size="lg" color="gray.800">
              {video.title}
            </Heading>
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.500">
                {uploadDate}にアップロード
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </Container>
  );
}
