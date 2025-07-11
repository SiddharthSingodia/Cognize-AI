// import React from 'react'
// import Image from 'next/image'
// import Link from 'next/link'

// function ImageListTab({chat}) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//         {chat?.searchResult?.map((result, index) => (
//             <Link href={result.url || '#'} target="_blank" key={index}>
//                 <div className='border rounded-lg p-3 hover:border-black cursor-pointer h-full flex flex-col'>
//                     <div className="relative w-full h-48 mb-2 overflow-hidden bg-gray-100 rounded-lg">
//                         {result?.img ? (
//                             <Image
//                                 src={result.img}
//                                 alt={result.title || 'Image result'}
//                                 fill
//                                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                 className="object-cover rounded-lg"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = `https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`;
//                                 }}
//                             />
//                         ) : (
//                             <Image
//                                 src={`https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=128`}
//                                 alt='favicon'
//                                 fill
//                                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                 className="object-contain p-4 rounded-lg"
//                             />
//                         )}
//                     </div>
//                     <div className="flex-1">
//                         <h3 className="text-sm font-medium line-clamp-2">{result.title}</h3>
//                         <div className="flex items-center gap-1 mt-2">
//                             <Image
//                                 src={`https://www.google.com/s2/favicons?domain=${result.displayLink}&sz=16`}
//                                 alt='favicon'
//                                 width={16}
//                                 height={16}
//                                 className="rounded-full"
//                             />
//                             <p className="text-xs text-gray-500 truncate">{result.displayLink}</p>
//                         </div>
//                     </div>
//                 </div>
//             </Link>
//         ))}
//     </div>
//   )
// }

// export default ImageListTab

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function ImageListTab({chat}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {chat?.searchResult?.map((result, index) => (
            <Link href={result.url || '#'} target="_blank" key={index}>
                <div className='border rounded-lg p-3 hover:border-black cursor-pointer h-full flex flex-col'>
                    <div className="relative w-full h-48 mb-2 overflow-hidden bg-gray-100 rounded-lg">
                        {result?.img ? (
                            <Image
                                src={result.img}
                                alt={result.title || 'Image result'}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover rounded-lg"
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
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain p-4 rounded-lg"
                            />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium line-clamp-2">{result.title}</h3>
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
                    </div>
                </div>
            </Link>
        ))}
    </div>
  )
}

export default ImageListTab