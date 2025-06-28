import React from 'react'
import DisplaySummery from './DisplaySummery'
import SourceList from './SourceList'



function AnswerDisplay({chat, loadingSearch}) {
  
  return (
    <div className='flex gap-2 flex-wrap mt-5'>
      <div >
       <SourceList webResult={chat?.searchResult} loadingSearch={loadingSearch}/>
       <DisplaySummery aiResp={chat?.aiResp}/>
      </div>
    </div>
  )
}

export default AnswerDisplay