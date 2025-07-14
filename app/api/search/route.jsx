import { NextResponse } from 'next/server';
import axios from 'axios'; // Import axios


// export async function POST(request) {
//   try {
//     // Parse the request body to get the user's query
//     const { query } = await request.json();

//     if (!query) {
//       return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
//     }

//     // Access your secret API keys from environment variables
//     const apiKey = process.env.GOOGLE_API_KEY;
//     const searchEngineId = process.env.SEARCH_ENGINE_ID;

//     if (!apiKey || !searchEngineId) {
//       return NextResponse.json({ error: 'API key or Search Engine ID is not configured.' }, { status: 500 });
//     }

//     // Construct the Google Custom Search API URL
//     const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;

//     console.log(`Fetching search results from: ${url}`);

//     // Use axios to fetch the search results
//     const response = await axios.get(url);

//     // axios automatically parses JSON and throws an error for non-2xx responses
//     const data = response.data;

//     // Extract the most useful information: title, link, and snippet
//     const results = data.items ? data.items.map(item => ({
//       title: item.title,
//       link: item.link,
//       snippet: item.snippet,
//       video: item.pagemap?.videoobject?.[0]?.url,
//       image: item.pagemap?.imageobject?.[0]?.url,
//     })) : [];

//     // Return the formatted search results to the frontend
//     return NextResponse.json({ results });

//   } catch (error) {
//     console.error('Error in search API route:', error);

//     // Handle axios errors specifically
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error('Google Search API Error Response:', error.response.data);
//         return NextResponse.json(
//           { error: `API request failed with status ${error.response.status}: ${error.response.data.error?.message || 'Unknown error'}` },
//           { status: error.response.status }
//         );
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error('No response received from Google Search API:', error.request);
//         return NextResponse.json({ error: 'No response received from external API.' }, { status: 500 });
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.error('Error setting up Google Search API request:', error.message);
//         return NextResponse.json({ error: `Error setting up API request: ${error.message}` }, { status: 500 });
//       }
//     }

//     // General internal server error
//     return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
//   }
// }


export async function POST(req) {
  const { searchInput, searchType } = await req.json();

  if (searchInput) {
    // Access your secret API keys from environment variables
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID;

    let apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchInput)}&num=5`;

    // If the searchType is 'video', try to fetch only video results
    if (searchType === 'video') {
      // Option 1: If you have a dedicated video CSE, use its ID here
      // const videoSearchEngineId = process.env.GOOGLE_VIDEO_SEARCH_ENGINE_ID;
      // apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${videoSearchEngineId}&q=${encodeURIComponent(searchInput)}&num=5`;

      // Option 2: Otherwise, append 'videos' to the query to bias results
      apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchInput + ' videos')}&num=5`;
    }

    // If the searchType is 'image', use searchType=image for image-only results
    if (searchType === 'image') {
      apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchInput+ ' images')}&searchType=image&num=5`;
    }

    const result = await axios.get(apiUrl);
    console.log(result.data);
    return NextResponse.json(result.data);
  } else {
    return NextResponse.json({ error: 'Search input is required' }, { status: 400 });
  }
}