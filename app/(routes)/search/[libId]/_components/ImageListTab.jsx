import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function ImageListTab({ chat, loading }) {
  const imageResults = chat?.searchResult || [];

  if (loading) {
    return <div className="col-span-full text-center text-muted-foreground py-12">Loading images…</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {(!imageResults || imageResults.length === 0) && (
        <div className="col-span-full text-center text-muted-foreground py-12">
          No related images found for this search.
        </div>
      )}
      {imageResults?.map((result, index) => (
        <Link href={result.url || '#'} target="_blank" rel="noopener noreferrer" key={index}>
          <div className="border rounded-2xl p-4 bg-white/80 dark:bg-gray-900/70 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col">
            <div className="relative w-full h-48 mb-3 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              {result?.img ? (
                <Image
                  src={result.img}
                  alt={result.title || 'Image result'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img.png'; // fallback to a local placeholder if needed
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="text-sm text-muted-foreground mb-2">No image preview available</span>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">Visit site for images</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-base font-semibold line-clamp-2">{result.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.displayLink}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ImageListTab