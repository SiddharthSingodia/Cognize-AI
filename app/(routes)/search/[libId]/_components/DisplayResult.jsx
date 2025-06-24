import React from 'react'
import { Tabs } from 'lucide-react' 
import { useState } from 'react'
import { LucideImage, LucideList, LucideSparkles, LucideVideo   } from 'lucide-react'
import AnswerDisplay from './AnswerDisplay'
import axios from 'axios'
import { useEffect } from 'react'
import { SEARCH_RESULT } from '../../../../../services/Shared'
import supabase from '../../../../../services/superbase.jsx'
import { useParams } from 'next/navigation'


    const tabs=[
    { label: 'Answer', icon:LucideSparkles},
    { label: 'Images', icon:LucideImage},
    { label: 'Videos', icon:LucideVideo},
    { label: 'Sources', icon:LucideList , badge:10},
]
function DisplayResult({searchInputRecord}) {
 
    const [activeTab, setActiveTab] = useState('Answer');
    const [searchResult,setSearchResult]=useState(SEARCH_RESULT);
    const{libId}=useParams();


    useEffect(() => {
        if (!searchInputRecord?.searchInput) {
            return;
        }
       searchInputRecord&&GetSearchApiResult();
    }, [searchInputRecord]);

    const GetSearchApiResult=async()=>{
       
        // const result = await axios.post('/api/search',{
        //     // query:searchInputRecord?.searchInput
        //     searchInput:searchInputRecord?.searchInput,
        //     searchType:searchInputRecord?.type   

        // })
        // console.log(result.data);
        // console.log(JSON.stringify(result.data))

         const searchResp= SEARCH_RESULT;
        //save to db
        const formattedSearchResp = searchResp?.items?.map((item) => {
            return {
                title: item.title,
                link: item.link,
                snippet: item.snippet,
                url: item.link,
                img: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src || '',
            }
        });
        console.log("Formatted Search Response:", formattedSearchResp);

        //fetch latest from db
        const {data, error}=await supabase
        .from('Chats')
        .insert([
            { 
                llibid:libId,
                searchResult:formattedSearchResp
            }
        ])
        .select()
        console.log(data);
        
    }



      return (
    <div className='mt-7'>
        <h2 className='font-medium text-3xl line-clamp-2' >{searchInputRecord?.searchInput}</h2>
        
        
<div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">

{tabs.map(({ label, icon: Icon, badge }) => (

    <button

        key={label}

        onClick={() => setActiveTab(label)}

        className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${activeTab === label ? 'text-black' : ''

            }`}

    >

        <Icon className="w-4 h-4" />

        <span>{label}</span>

        {badge && (

            <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">

                {badge}

            </span>

        )}

        {activeTab === label && (

            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>

        )}

    </button>

))}

<div className="ml-auto text-sm text-gray-500">

    1 task <span className="ml-1">↗</span>

</div>

</div>
<div>
    {activeTab=='Answer'?
    <AnswerDisplay searchResult={searchResult}/>:null
    }
         
</div>
    </div>
  )
}

export default DisplayResult

