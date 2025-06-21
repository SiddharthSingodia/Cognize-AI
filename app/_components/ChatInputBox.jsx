'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.jsx"
import { ArrowRight, Atom, AudioLines, Cpu, Globe, Mic, Paperclip, SearchCheck } from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu.jsx"
import { AIModelsOption } from '../../services/Shared.jsx'
import { useUser } from '@clerk/nextjs'
import supabase from '../../services/superbase.jsx'
import { v4 as uuidv4 } from 'uuid';



const ChatInputBox = () => {

  const[userSearchInput,setUserSearchInput]=useState('');
  const [searchType, setSearchType]=useState('Search');
  const {user} = useUser();
const [loading, setloading]= useState(false);

  const onSearchQuery=async()=>{
    setloading(true);
    const libId=uuidv4();
    const {data}=await supabase.from('Library').insert([
      {
        searchInput:userSearchInput,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        type:searchType,
        libId:libId
      }
    ]).select();
    console.log(data[0]);
    setloading(false);
  }


  return (
    <div className='flex flex-col h-screen items-center justify-center w-full'>
        <Image src='/logo.png' alt='logo' width={250} height={250} style={{ width: 250, height: "auto" }} />
        <div className='p-2 w-full max-w-2xl border rounded-2xl mt-1'>
           

             <div className='flex justify-between items-end'>
             <Tabs defaultValue="Search" className="w-[400px]">
             <TabsContent value="Search">  <input type='text' placeholder='Ask me anything...'
             onChange={(e)=>setUserSearchInput(e.target.value)}
             className='w-full p-4 outline-none' /></TabsContent>

             <TabsContent value="Research"> <input type='text' placeholder='Research anything...'
             onChange={(e)=>setUserSearchInput(e.target.value)}
             className='w-full p-4 outline-none' /></TabsContent>
               <TabsList>
                    <TabsTrigger value="Search" className={'text-primary'} onClick={()=>setSearchType('Search')}><SearchCheck/>Search</TabsTrigger>
                 <TabsTrigger value="Research" className={'text-primary'} onClick={()=>setSearchType('Research')}> <Atom/>Research</TabsTrigger>
               </TabsList>
</Tabs>
<div className='flex gap-1 items-center'>
   
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <Button variant='ghost'>
    <Cpu  className='text-gray-500 h-4 w-4'/>
        </Button>

  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator /> */}
    {AIModelsOption.map((model,index)=>(
        <DropdownMenuItem key={index}>
            <div className='mb-1'>
            <h2 className='text-sm'>{model.name}</h2>
            <p className='text-xs text-gray-500'>{model.desc}</p>
                </div></DropdownMenuItem>
    ))}
   
  </DropdownMenuContent>
</DropdownMenu>



    <Button variant='ghost'>
    <Globe className='text-gray-500 h-4 w-4'/>
    </Button>
    <Button variant='ghost'>
    <Paperclip className='text-gray-500 h-4 w-4'/>
    </Button>
    <Button variant='ghost'>
    <Mic className='text-gray-500 h-4 w-4'/>
    </Button>
      <Button onClick={()=>{
        userSearchInput?onSearchQuery():null
      }} >
      {!userSearchInput ? <AudioLines className='text-white h-4 w-4'/>
      : <ArrowRight className ='text-white h-5 w-5' disabled={loading}/>}
      </Button>
</div>
             </div>
        </div>
    </div>
  ) 
}

export default ChatInputBox