"use client"

import { 
  Box, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Image, 
  Heading, 
  Text, 
  Skeleton,
  SkeletonText,
  VStack,
  Container,
  AspectRatio
} from "@chakra-ui/react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Video = { 
  id: number; 
  title: string; 
  created_at: string; 
  thumbnail_url: string | null; 
  hls_url: string | null 
}
const API = process.env.NEXT_PUBLIC_API_URL!

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/videos`, { cache: "no-store" })
      if (!res.ok) throw new Error("fetch error")
      const data: Video[] = await res.json()
      setVideos(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Heading mb={8} size="lg" color="gray.700">動画一覧</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[...Array(6)].map((_, i) => (
            <Card key={i} overflow="hidden">
              <Skeleton height="200px" />
              <CardBody>
                <SkeletonText noOfLines={2} spacing={2} />
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8} size="lg" color="gray.700">動画一覧</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {videos.map(v => {
          const uploadDate = new Date(v.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          
          return (
            <Link key={v.id} href={`/videos/${v.id}`} style={{ textDecoration: 'none' }}>
              <Card 
                overflow="hidden" 
                _hover={{ 
                  transform: 'translateY(-4px)', 
                  shadow: 'lg',
                  transition: 'all 0.2s'
                }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <AspectRatio ratio={16/9}>
                  {v.thumbnail_url ? (
                    <Image
                      src={v.thumbnail_url}
                      alt={v.title}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  ) : (
                    <Box 
                      bg="gray.200" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      color="gray.500"
                      fontSize="sm"
                    >
                      サムネイル生成中…
                    </Box>
                  )}
                </AspectRatio>
                <CardBody>
                  <VStack align="start" spacing={2}>
                    <Heading 
                      size="md" 
                      color="gray.800" 
                      noOfLines={2}
                      title={v.title}
                    >
                      {v.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {uploadDate}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </SimpleGrid>
    </Container>
  )
}
