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
import ImageListTab from './ImageListTab'





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
        // if (!searchInputRecord?.searchInput) {
        //     return;
        // }
       searchInputRecord?.Chats?.length==0 && GetSearchApiResult();
       setSearchResult(searchInputRecord)  
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
        const formattedSearchResp = searchResp?.items?.map((item,index) => {
            return {
                title: item?.title,
                snippet: item.snippet,
                displayLink:item?.displayLink,
                url:item?.link,
                img: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src || '',
                thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || '',

            }
        });
        console.log("Formatted Search Response:", formattedSearchResp);

        //fetch latest from db
        const {data, error}=await supabase
          .from('Chats')
          .insert([
            { 
                libId:libId,
                searchResult:formattedSearchResp,
                userSearchInput: searchInputRecord?.searchInput
            }
        ])
        .select()
    //  console.log(data[0].id);

        await GenerateAIResp(formattedSearchResp,data[0].id);
        // pass to llm 
          
    }

    const GenerateAIResp= async(formattedSearchResp, recordId)=>{
        const result = await axios.post('/api/llm-model',{
            searchInput:searchInputRecord?.searchInput,
            searchResult:formattedSearchResp,
            recordId:recordId
        })
        console.log(result.data);
        const runId=result.data;

        const interval= setInterval(async()=>{

            const runResp= await axios.post('/api/get-inngest-status',{
                runId:runId
            })

            if(runResp?.data?.data[0]?.status=='Completed'){
                console.log("Completed!!!");
                clearInterval(interval);
                // get updated daata from db
                
                
            }

        }, 1000);
        // const runResp= await axios.post('/api/get-inngest-status',{
        //             runId:runId
        //         })
        //         console.log(runResp.data)
        
       
        
        
    }



      return (
    <div className='mt-7'>
        {searchResult?.Chats?.map((chat, index) => (
            <div key={index}>

                <h2 className='font-bold text-3xl text-gray-600 line-clamp-2'>{searchInputRecord?.searchInput}</h2>
                <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
                    {tabs.map(({ label, icon: Icon, badge }) => (
                        <button
                            key={label}
                            onClick={() => setActiveTab(label)}
                            className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${activeTab === label ? 'text-black' : ''}`}
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
                    {activeTab === 'Answer' ? <AnswerDisplay chat={chat} /> : 
                    activeTab=='Images'? <ImageListTab chat={chat} /> :null}
                </div>
                <hr className='my-5'/> 
            </div>
        ))}
    </div>
  )
}

export default DisplayResult

