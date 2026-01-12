'use client'

const YouTubeShorts = ({ videoId }: { videoId: string }) => {
  return (
    <div className="mx-auto my-12 max-w-[350px] overflow-hidden rounded-[2.5rem] border-[6px] border-gray-900 bg-black shadow-2xl dark:border-gray-800">
      <div className="relative aspect-[9/16]">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?playsinline=1`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title="YouTube Shorts"
        />
      </div>
    </div>
  )
}

export default YouTubeShorts
