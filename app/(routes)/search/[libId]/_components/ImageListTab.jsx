import React from 'react'
import Image from 'next/image'


function ImageListTab({chat}) {
  return (
    <div>
        {chat?.searchResult?.map((result,index)=>(
            <div key={index} className='border rounded-lg p-3 hover:border-black cursor-pointer'>
                <Image
                    src={result?.img}
                    alt={result?.title}
                    width={200}
                    height={200}
                    className="rounded-lg"
                />
            </div>
        ))}
    </div>
  )
}

export default ImageListTab