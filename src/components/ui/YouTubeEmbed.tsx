interface YouTubeEmbedProps {
  url: string
  title: string
  className?: string
}

export function YouTubeEmbed({ url, title, className = "" }: YouTubeEmbedProps) {
  const toEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const u = new URL(url)
        const id = u.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}?rel=0` : url
      }
      if (url.includes('youtu.be/')) {
        const after = url.split('youtu.be/')[1] || ''
        const id = after.split(/[?&]/)[0]
        return id ? `https://www.youtube.com/embed/${id}?rel=0` : url
      }
      if (url.includes('youtube.com/embed/')) {
        return url.includes('?') ? url : `${url}?rel=0`
      }
      return url
    } catch {
      return url
    }
  }

  return (
    <div className={`rounded-xl border border-white/10 bg-black/40 overflow-hidden ${className}`}>
      <div className="relative w-full pt-[56.25%]">
        <iframe
          src={toEmbedUrl(url)}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}