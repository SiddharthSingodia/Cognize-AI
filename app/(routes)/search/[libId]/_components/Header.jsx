import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Clock, Link, Send } from 'lucide-react'
import { Button } from '../../../../../components/ui/button.jsx'     

// Custom function to format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

function Header({searchInputRecord} ) {
  return (
    <div className='p-4 border-b flex justify-between items-center'>
        <div className='flex items-center gap-2'>
            <UserButton/> 
        <div className='flex items-center gap-1'>
            <Clock className='h-5 w-5 text-gray-500' />
            <h2 className='text-sm text-gray-500'>{formatRelativeTime(searchInputRecord?.created_at)}</h2>
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