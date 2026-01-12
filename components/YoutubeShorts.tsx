'use client'

import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'

const YouTubeShorts = ({ videoId }: { videoId: string }) => {
  const [hasWindow, setHasWindow] = useState(false)

  // 하이드레이션 오류 방지 (서버사이드 렌더링 대응)
  useEffect(() => {
    setHasWindow(true)
  }, [])

  if (!hasWindow)
    return <div className="aspect-[9/16] w-full animate-pulse rounded-[2.5rem] bg-gray-100" />

  return (
    <div className="mx-auto my-12 max-w-[350px] overflow-hidden rounded-[2.5rem] border-[6px] border-gray-900 bg-black shadow-2xl dark:border-gray-800">
      <div className="relative aspect-[9/16]">
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          controls={true}
          config={{
            youtube: {
              playerVars: {
                origin: typeof window !== 'undefined' ? window.location.origin : '',
                modestbranding: 1,
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default YouTubeShorts
