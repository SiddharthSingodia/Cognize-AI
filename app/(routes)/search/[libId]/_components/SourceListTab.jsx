import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function SourceListTab({chat}) {
  return (
    <div className='flex flex-col gap-4 mt-4'>
        {chat?.searchResult?.map((result, index) => (
          <div key={index} className='border rounded-lg p-4 hover:border-black cursor-pointer transition-all hover:shadow-md'>
            <div className='flex items-center gap-3'>
              <div className="flex-shrink-0 font-bold text-gray-500 w-6 text-center">{index + 1}</div>
              <div className='relative h-12 w-12 overflow-hidden bg-gray-100 rounded-full flex-shrink-0'>
                {result?.img ? (
                  <Image
                    src={result.img}
                    alt={result.title || 'Image result'}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`;
                    }}
                  />
                ) : (
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`}
                    alt='favicon'
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className='flex items-center gap-1 mb-1 w-full overflow-hidden'>
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=16`}
                    alt='favicon'
                    width={16}
                    height={16}
                    className="rounded-full flex-shrink-0"
                  />
                  <p className='text-sm text-gray-500 truncate w-full'>{result?.displayLink}</p>
                </div>
                <Link href={result?.url || '#'} target='_blank'>
                  <h2 className='text-blue-700 font-medium hover:underline line-clamp-2 mb-1'>{result?.title}</h2>
                </Link>
                <p className='text-sm text-gray-600 line-clamp-5'>{result?.snippet}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
