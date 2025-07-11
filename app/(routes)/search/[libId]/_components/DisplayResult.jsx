import React from 'react'
import { Tabs } from 'lucide-react' 
import { useState } from 'react'
import { LucideImage, LucideList, LucideSparkles, LucideVideo, Send, Loader2 as Loader2Icon } from 'lucide-react'
import AnswerDisplay from './AnswerDisplay'
import axios from 'axios'
import { useEffect } from 'react'
import { SEARCH_RESULT } from '../../../../../services/Shared'
import supabase from '../../../../../services/superbase.jsx'
import { useParams } from 'next/navigation'
import ImageListTab from './ImageListTab'
import SourceListTab from './SourceListTab'
import VideoListTab from './VideoListTab'
import { Button } from '../../../../../components/ui/button.jsx'
import DisplaySummery from './DisplaySummery'




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
    const [loadingSearch, setLoadingSearch]=useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [userInput, setUserInput] = useState('');

    // Reset hasSearched when libId changes
    useEffect(() => {
        setHasSearched(false);
    }, [libId]);

    useEffect(() => {
        // if (!searchInputRecord?.searchInput) {
        //     return;
        // }
       searchInputRecord?.Chats?.length==0 ? GetSearchApiResult():GetSearchRecords();
       setSearchResult(searchInputRecord)  
    }, [searchInputRecord]);

    const GetSearchApiResult=async()=>{
       setLoadingSearch(true);
        const result = await axios.post('/api/search',{
            // query:searchInputRecord?.searchInput
            searchInput: userInput || searchInputRecord?.searchInput,
            searchType: searchInputRecord?.type || 'Search'
        })
        console.log(result.data);
        console.log(JSON.stringify(result.data))
 
         const searchResp= result.data;
        //save to db
        const formattedSearchResp = searchResp?.items?.map((item,index) => {
            return {
                title: item?.title,
                snippet: item.snippet,
                displayLink:item?.displayLink,
                url:item?.link,
                img: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src || '',
                thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || '',
                video: item.pagemap?.cse_video?.[0]?.src || '',

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
    await GetSearchRecords();
          setLoadingSearch(false);
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
                await GetSearchRecords();
                clearInterval(interval);
                // get updated daata from db
                
                
            }

        }, 1000);
        // const runResp= await axios.post('/api/get-inngest-status',{
        //             runId:runId
        //         })
        //         console.log(runResp.data)
        
       
        
        
    }
    
    const GetSearchRecords=async()=>{
        let { data : Library, error}= await supabase
        .from('Library')
        .select('*, Chats(*)')
        .eq('libId', libId)

        setSearchResult(Library[0])
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
                    {activeTab === 'Answer' ? (
                      <>
                        <AnswerDisplay chat={chat} loadingSearch={loadingSearch}/>
                        <DisplaySummery aiResp={chat.aiResp} />
                      </>
                    ) : 
                    activeTab=='Images'? <ImageListTab chat={chat} /> :
                    activeTab=='Sources'? <SourceListTab chat={chat}/>:
                    activeTab=='Videos'? <VideoListTab chat={chat}/>:
                    null}
                </div>
                <hr className='my-5'/> 
            </div>
        ))} 
        <div className='bg-white w-full mb-6 border rounded-lg shadow-md p-3 px-5 flex justify-between fixed bottom-6 max-w-md lg:max-w-xl xl:max-w-3xl'>
           <input 
               placeholder='Type Anything...' 
               className='outline-none flex-1'
               
               onChange={(e) => setUserInput(e.target.value)}
           />
           {userInput?.length && <Button onClick={GetSearchApiResult} disable={loadingSearch}>
                {loadingSearch?<Loader2Icon className='animate-spin'/>:<Send/>} </Button>}
        </div>
    </div>
  )
}

export default DisplayResult

