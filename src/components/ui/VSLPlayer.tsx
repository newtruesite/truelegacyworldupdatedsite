import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface VSLPlayerProps {
    youtubeId: string
    title?: string
}

export function VSLPlayer({ youtubeId, title }: VSLPlayerProps) {
    const [playing, setPlaying] = useState(false)

    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl glow-blue">
            {!playing ? (
                <motion.div
                    className="relative cursor-pointer group"
                    style={{ aspectRatio: '16/9' }}
                    onClick={() => setPlaying(true)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Thumbnail */}
                    <img
                        src={thumbnailUrl}
                        alt={title || 'True Legacy World Video'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            // Fallback to HQ if maxres fails
                            const target = e.target as HTMLImageElement
                            if (target.src.includes('maxresdefault')) {
                                target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                            }
                        }}
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl animate-pulse-glow"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="h-8 w-8 text-white ml-1" fill="white" />
                        </motion.div>
                    </div>

                    {/* Watch CTA */}
                    {title && (
                        <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-sm font-semibold text-white/80 text-center">
                                {title}
                            </p>
                        </div>
                    )}
                </motion.div>
            ) : (
                <div style={{ aspectRatio: '16/9' }}>
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&showinfo=0`}
                        title={title || 'True Legacy World VSL'}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    )
}
