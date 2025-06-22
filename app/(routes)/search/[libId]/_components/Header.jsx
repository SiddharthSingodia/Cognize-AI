import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Clock, Link, Send } from 'lucide-react'
import moment from 'moment'
import { Button } from '../../../../../components/ui/button.jsx'     

function Header({searchInputRecord} ) {
  return (
    <div className='p-4 border-b flex justify-between items-center'>
        <div className='flex items-center gap-2'>
            <UserButton/> 
        <div className='flex items-center gap-1'>
            <Clock className='h-5 w-5 text-gray-500' />
            <h2 className='text-sm text-gray-500'>{moment(searchInputRecord?.created_at).fromNow()}</h2>
        </div>
        </div>
        <h2 className='line-clamp-1 max-w-md'>{searchInputRecord?.searchInput}</h2>

        <div className='flex gap-2'>
            <Button> <Link/></Button>
            <Button> <Send/> Share</Button>
        </div>
    </div>
  )
}

export default Header