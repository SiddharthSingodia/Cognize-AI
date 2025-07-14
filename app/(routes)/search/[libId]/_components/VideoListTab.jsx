import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function VideoListTab({ chat, loading }) {
  const videoResults = chat?.searchResult || [];

  if (loading) {
    return <div className="col-span-full text-center text-muted-foreground py-12">Loading videos…</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {(!videoResults || videoResults.length === 0) && (
        <div className="col-span-full text-center text-muted-foreground py-12">
          No related videos found for this search.
        </div>
      )}
      {videoResults?.map((result, index) => (
        <div key={index} className="border rounded-2xl p-4 bg-white/80 dark:bg-gray-900/70 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col">
          <Link href={result.url} target="_blank" rel="noopener noreferrer">
            <div className="relative w-full h-48 mb-3 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
              <Image
                src={result.thumbnail || result.img || `https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`}
                alt={result.title || 'Video result'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`;
                }}
              />
            </div>
          </Link>
          <div className="flex-1 flex flex-col justify-between">
            <Link href={result.url} target="_blank" rel="noopener noreferrer">
              <h3 className="text-base font-semibold line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{result.title}</h3>
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <Image
                src={`https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=16`}
                alt='favicon'
                width={16}
                height={16}
                className="rounded-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.displayLink}</p>
            </div>
            {result.snippet && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{result.snippet}</p>
            )}
            <Link href={result.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
              Watch Video →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}