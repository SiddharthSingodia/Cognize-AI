import React from 'react'

function AnswerDisplay({searchResult}) {
  const webResult = searchResult?.results?.filter((result)=>result.type=='web')
  return (
    <div>
      <div>
        {webResult?.map((result,index)=>(
          <div key={index}>
            <h2>{result.title}</h2>
            <p>{result.snippet}</p>
            <a href={result.link}>Link</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnswerDisplay