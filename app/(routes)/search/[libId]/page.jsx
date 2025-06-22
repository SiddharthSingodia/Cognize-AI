"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import supabase from '../../../../services/superbase.jsx'
import Header from './_components/Header'
import DisplayResult from './_components/DisplayResult'




 export default function SearchQueryResult(){
    const {libId}=useParams();  
     const[searchInputRecord,setSearchInputRecord]=useState(null);

     useEffect(()=>{
        GetSearchQueryRecord();
     },[])

    const GetSearchQueryRecord= async()=>{

        let {data:Library, error}=await supabase.from('Library')
        .select('*')
        .eq('libId',libId);
            console.log(Library[0]);
            setSearchInputRecord(Library[0]);
     }
    return( 
        <div>  
            <h2>
                <Header searchInputRecord={searchInputRecord}/>
                <div className='px-10 md:px-20 lg:px-36 xl:px-56 mt-20'>
                <DisplayResult searchInputRecord={searchInputRecord}/>
                </div>
            </h2>
        </div>
    )
}   