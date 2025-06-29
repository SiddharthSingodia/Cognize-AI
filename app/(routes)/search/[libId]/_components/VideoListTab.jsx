import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function VideoListTab({chat}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {chat?.searchResult?.map((result, index) => (
        <div key={index} className='border rounded-lg p-3 hover:border-black cursor-pointer h-full flex flex-col'>
          <Link href={result.url || '#'} target="_blank">
            <div className="relative w-full h-48 mb-2 overflow-hidden bg-gray-100 rounded-lg">
              {result?.video ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <Image
                    src={result.thumbnail || result.img || `https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`}
                    alt={result.title || 'Video result'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`;
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`}
                    alt='favicon'
                    width={64}
                    height={64}
                    className="object-contain p-2"
                  />
                  <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    No video available
                  </div>
                </div>
              )}
            </div>
          </Link>
          <div className="flex-1">
            <Link href={result.url || '#'} target="_blank">
              <h3 className="text-sm font-medium line-clamp-2 hover:text-blue-600">{result.title}</h3>
            </Link>
            <div className="flex items-center gap-1 mt-2">
              <Image
                src={`https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=16`}
                alt='favicon'
                width={16}
                height={16}
                className="rounded-full"
                />
                <p className="text-xs text-gray-500 truncate">{result.displayLink}</p>
            </div>
            {result.snippet && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.snippet}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}