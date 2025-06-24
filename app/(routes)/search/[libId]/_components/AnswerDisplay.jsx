import React from 'react'
import Image from 'next/image'

function AnswerDisplay({searchResult}) {
  const webResult = searchResult?.items
  return (
    <div className='flex gap-2 flex-wrap mt-5'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        {webResult?.map((result,index)=>(
          <div key={index} className='border rounded-lg p-3 hover:border-black cursor-pointer'>
           <div className='flex items-center gap-1'>
           <Image src={`https://www.google.com/s2/favicons?domain=${result.link}&sz=128`} 
           alt='favicon' width={20} height={20}
           className="rounded-full" />
            <h2 className='text-sm text-gray-500'>{result.displayLink}</h2>
           
           </div>
           <a href={result.link} target='_blank'>
           <h2 className='text-blue-700 text-lg mt-2 visited:text-purple-700 line-clamp-1'>{result.title}</h2>
           </a>
            <p className='text-sm text-gray-600 line-clamp-2'>{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnswerDisplay