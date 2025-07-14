'use client'
import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import supabase from '../../services/superbase.jsx';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function ChatInputBox() {
  const [userSearchInput, setUserSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSearchQuery = async () => {
    if (!userSearchInput.trim()) return;
    setLoading(true);
    const libId = uuidv4();
    await supabase.from('Library').insert([
      {
        searchInput: userSearchInput,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        type: 'Search',
        libId: libId,
      },
    ]).select();
    setLoading(false);
    router.push(`/search/` + libId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Ask Anything, Get a Summary
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-8 text-center max-w-md">
          Enter your question or topic below. WebWise AI will search the web and return a clean, concise summary in seconds.
        </p>
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center px-4 py-2 md:py-3 gap-2 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-lg md:text-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-2 py-2"
            placeholder="Type your question or topic…"
            value={userSearchInput}
            onChange={e => setUserSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') onSearchQuery();
            }}
            disabled={loading || !user}
            aria-label="Type your question or topic"
            autoFocus
          />
          <button
            onClick={onSearchQuery}
            disabled={loading || !user || !userSearchInput.trim()}
            className={`ml-2 rounded-full p-2 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Send"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
        {!user && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            Please sign in to use WebWise AI.
          </div>
        )}
      </div>
    </div>
  );
}