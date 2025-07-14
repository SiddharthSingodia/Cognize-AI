import React, { useState, useEffect } from 'react';
import { LucideImage, LucideList, LucideSparkles, LucideVideo, Send, Loader2 as Loader2Icon } from 'lucide-react';
import AnswerDisplay from './AnswerDisplay';
import axios from 'axios';
import { SEARCH_RESULT } from '../../../../../services/Shared';
import supabase from '../../../../../services/superbase.jsx';
import { useParams } from 'next/navigation';
import ImageListTab from './ImageListTab';
import SourceListTab from './SourceListTab';
import VideoListTab from './VideoListTab';
import DisplaySummery from './DisplaySummery';

const tabs = [
  { label: 'Answer', icon: LucideSparkles },
  { label: 'Images', icon: LucideImage },
  { label: 'Videos', icon: LucideVideo },
  { label: 'Sources', icon: LucideList },
];

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState('Answer');
  const [searchResult, setSearchResult] = useState(SEARCH_RESULT);
  const { libId } = useParams();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [videoResults, setVideoResults] = useState(null); // For video tab only
  const [imageResults, setImageResults] = useState(null); // For image tab only

  useEffect(() => {
    setHasSearched(false);
  }, [libId]);

  useEffect(() => {
    searchInputRecord?.Chats?.length === 0 ? GetSearchApiResult() : GetSearchRecords();
    setSearchResult(searchInputRecord);
  }, [searchInputRecord]);

  // Fetch video results only when Videos tab is selected
  useEffect(() => {
    if (activeTab === 'Videos' && !videoResults) {
      fetchVideoResults();
    }
  }, [activeTab]);

  // Fetch image results only when Images tab is selected
  useEffect(() => {
    if (activeTab === 'Images' && !imageResults) {
      fetchImageResults();
    }
  }, [activeTab]);

  const fetchVideoResults = async () => {
    setLoadingSearch(true);
    const result = await axios.post('/api/search', {
      searchInput: userInput || searchInputRecord?.searchInput,
      searchType: 'video',
    });
    const searchResp = result.data;
    const formattedSearchResp = searchResp?.items?.map((item) => ({
      title: item?.title,
      snippet: item.snippet,
      displayLink: item?.displayLink,
      url: item?.link,
      img: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src || '',
      thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || '',
      video: item.pagemap?.cse_video?.[0]?.src || '',
    }));
    setVideoResults(formattedSearchResp);
    setLoadingSearch(false);
  };

  const fetchImageResults = async () => {
    setLoadingSearch(true);
    const result = await axios.post('/api/search', {
      searchInput: userInput || searchInputRecord?.searchInput,
      searchType: 'image',
    });
    const searchResp = result.data;
    // For image search, use item.link as the image, item.image.contextLink as the page URL
    const formattedSearchResp = searchResp?.items?.map((item) => ({
      title: item?.title,
      snippet: item.snippet,
      displayLink: item?.displayLink,
      img: item.link, // direct image URL
      url: item.image?.contextLink || item.link, // page where image appears
    }));
    setImageResults(formattedSearchResp);
    setLoadingSearch(false);
  };

  const GetSearchApiResult = async () => {
    setLoadingSearch(true);
    setImageResults(null); // Reset image results for new search
    setVideoResults(null); // Reset video results for new search
    const result = await axios.post('/api/search', {
      searchInput: userInput || searchInputRecord?.searchInput,
      searchType: searchInputRecord?.type || 'Search',
    });
    const searchResp = result.data;
    const formattedSearchResp = searchResp?.items?.map((item) => ({
      title: item?.title,
      snippet: item.snippet,
      displayLink: item?.displayLink,
      url: item?.link,
      img: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src || '',
      thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || '',
      video: item.pagemap?.cse_video?.[0]?.src || '',
    }));
    const { data } = await supabase
      .from('Chats')
      .insert([
        {
          libId: libId,
          searchResult: formattedSearchResp,
          userSearchInput: searchInputRecord?.searchInput,
        },
      ])
      .select();
    await GetSearchRecords();
    setLoadingSearch(false);
    await GenerateAIResp(formattedSearchResp, data[0].id);
  };

  const GenerateAIResp = async (formattedSearchResp, recordId) => {
    const result = await axios.post('/api/llm-model', {
      searchInput: searchInputRecord?.searchInput,
      searchResult: formattedSearchResp,
      recordId: recordId,
    });
    const runId = result.data;
    const interval = setInterval(async () => {
      const runResp = await axios.post('/api/get-inngest-status', {
        runId: runId,
      });
      if (runResp?.data?.data[0]?.status === 'Completed') {
        await GetSearchRecords();
        clearInterval(interval);
      }
    }, 1000);
  };

  const GetSearchRecords = async () => {
    let { data: Library } = await supabase
      .from('Library')
      .select('*, Chats(*)')
      .eq('libId', libId);
    setSearchResult(Library[0]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 mb-32 px-2 md:px-0">
      {searchResult?.Chats?.map((chat, index) => (
        <div key={index} className="mb-10">
          <h2 className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-4 line-clamp-2">
            {searchInputRecord?.searchInput}
          </h2>
          <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-1 relative text-base font-medium px-3 py-1 rounded-lg transition-colors duration-150
                  ${activeTab === label
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-300'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {activeTab === label && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></span>
                )}
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'Answer' ? (
              <>
                <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />
                <DisplaySummery aiResp={chat.aiResp} />
              </>
            ) : activeTab === 'Images' ? (
              <ImageListTab chat={{ ...chat, searchResult: imageResults }} loading={loadingSearch} />
            ) : activeTab === 'Sources' ? (
              <SourceListTab chat={chat} />
            ) : activeTab === 'Videos' ? (
              <VideoListTab chat={{ ...chat, searchResult: videoResults }} loading={loadingSearch} />
            ) : null}
          </div>
        </div>
      ))}
      {/* Modern Chat Input at the bottom */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-6 z-40 border-t border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-xl flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 md:py-3 gap-2 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
          <input
            placeholder="Type your question or topic…"
            className="flex-1 bg-transparent outline-none text-lg md:text-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-2 py-2"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') GetSearchApiResult();
            }}
            disabled={loadingSearch}
            aria-label="Type your question or topic"
          />
          <button
            onClick={GetSearchApiResult}
            disabled={loadingSearch || !userInput.trim()}
            className="ml-2 rounded-full p-2 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            {loadingSearch ? (
              <Loader2Icon className="animate-spin w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisplayResult;

