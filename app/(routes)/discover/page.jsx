'use client'
import React from 'react'
import { DollarSign, Globe, Palette, Star, Cpu, Trophy } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

import NewsCard from './_components/NewsCard.jsx'



const options=[
    {
        title:'Top',
        icon:Star
    },
    {
        title:'Tech &Science',
        icon:Cpu    
    },
    {
        title:'Finance',
        icon:DollarSign
    },
    {
        title:'Art & Culture',
        icon:Palette
    },
    {
        title:'Sports',
        icon:Trophy
    },
]
function Discover() {

    const [selectedOption , setSelectedOption]=useState('Top');
    const[latestNews, setLatestNews]=useState();

    useEffect(()=>{
       selectedOption && GetSearchResult();
    },[selectedOption]
)

    const GetSearchResult=async()=>{
        try {
            const result=await axios.post('/api/search',{
                searchInput:selectedOption+'latest News & Updates',
                searchType:'Search'
            })
            console.log(result.data);
            // The API returns the full response object, so we need to access the items array
            const webSearchResult=result?.data?.items;
            setLatestNews(webSearchResult || []);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setLatestNews([]);
        }
        
    }
  return (
    <div className='mt-20 px-10 md:px-20 lg:px-36 xl:px-56'>
        <h2 className='font-bold text-2xl gap-2 item-center'><Globe/><span>Discover </span></h2>
        <div className=' flex gap-2 mt-5'>
            {options?.map((option,index)=>(
                <div key={index}
                onClick={()=>setSelectedOption(option?.title)}
                 className={`flex gap-2 p-1 px-3 hover:text-primary cursor-pointer rounded-full${selectedOption==option?.title && 'text-primary'}`}>
                    {/* <h2 className='font-bold '>{option?.title}</h2> */}
                    <option.icon className='w-5 h-5'/>
                    <h2 className='text-sm '>{option?.title}</h2>
                </div> 
            ))}
        </div>
        <div className="mt-8">
            {Array.isArray(latestNews) && latestNews.length > 0 ? (
                <div className="grid gap-6">
                    {latestNews.map((news,index)=>(
                        <NewsCard key={index} news={news}/>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No news available at the moment.
                </div>
            )}
        </div>
    </div>
  )
}

export default Discover