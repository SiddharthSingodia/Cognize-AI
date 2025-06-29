'use client'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import supabase from '../../../services/superbase.jsx'
import { useEffect } from 'react'
import { useState } from 'react'
import moment from 'moment'
import { SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'





function Library () {
    const {user}=useUser();
    const[libraryHistory,setLibraryHistory]=useState([]);
    const router = useRouter();

    useEffect(() => {
       user&& GetLibraryHistory();
    }, [user]);



    const GetLibraryHistory = async()=>{
        let {data:Library, error}=await supabase.from('Library')
        .select('*')
        .eq('userEmail' , user?.primaryEmailAddress?.emailAddress)
        .order('id',{ascending:false})
        console.log(Library);
        setLibraryHistory(Library);
    }
  return (
    <div className='mt-20 px-10 md:px-20 lg:px-36 xl:px-56'>
        <h2 className='font-bold text-2xl'>Library</h2>
        <div className='mt-7'>
            {libraryHistory?.map((item,index)=>(
                <div key={index} className='cursor-pointer hover:bg-gray-100 p-2' onClick={()=>router.push(`/search/${item.libId}`)}>
                  <div className='flex items-center justify-between'> 
                  <div>
                    <h2 className='font-bold '>{item?.searchInput}</h2>
                    {/* <p>{library?.type}</p> */}
                    <p className=' text-xs text-gray-500'>{moment(item.created_at).fromNow()}</p>
                   </div>
                   <SquareArrowOutUpRight className='w-5 h-5'/>
                    </div>
                    <hr className='my-2'/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Library 