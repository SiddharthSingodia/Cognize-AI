'use client'
import React, { useState, useEffect } from 'react';
import { DollarSign, Globe, Palette, Star, Cpu, Trophy } from 'lucide-react';
import axios from 'axios';
import NewsCard from './_components/NewsCard.jsx';

const options = [
  { title: 'Top', icon: Star },
  { title: 'Tech & Science', icon: Cpu },
  { title: 'Finance', icon: DollarSign },
  { title: 'Art & Culture', icon: Palette },
  { title: 'Sports', icon: Trophy },
];

export default function Discover() {
  const [selectedOption, setSelectedOption] = useState('Top');
  const [latestNews, setLatestNews] = useState();

  useEffect(() => {
    selectedOption && GetSearchResult();
  }, [selectedOption]);

  const GetSearchResult = async () => {
    try {
      const result = await axios.post('/api/search', {
        searchInput: selectedOption + ' latest News & Updates',
        searchType: 'Search',
      });
      const webSearchResult = result?.data?.items;
      setLatestNews(webSearchResult || []);
    } catch (error) {
      setLatestNews([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-2 md:px-0">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <Globe className="w-7 h-7 text-blue-600" />
            <h2 className="font-bold text-3xl text-gray-900 dark:text-white tracking-tight">Discover</h2>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            {options.map((option) => (
              <button
                key={option.title}
                onClick={() => setSelectedOption(option.title)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-150 shadow-sm border
                  ${selectedOption === option.title
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300'}
                `}
              >
                <option.icon className="w-4 h-4" />
                {option.title}
              </button>
            ))}
          </div>
        </div>
        {/* News Cards */}
        <div className="mt-8">
          {Array.isArray(latestNews) && latestNews.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((news, index) => (
                <NewsCard key={index} news={news} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 text-lg">
              No news available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}