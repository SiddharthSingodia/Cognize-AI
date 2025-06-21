import React from 'react'
import { useParams } from 'next/navigation'


 export default function SearchQueryResult(){
    const {libId}=useParams();  
    return(
        <div>
            <h1>SearchQueryResult</h1>
        </div>
    )
}