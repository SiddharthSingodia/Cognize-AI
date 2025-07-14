import { UserButton } from '@clerk/nextjs';
import React from 'react';
import { Clock, Link as LinkIcon, Send, Sparkles } from 'lucide-react';
import { Button } from '../../../../../components/ui/button.jsx';
import Link from 'next/link';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

function Header({ searchInputRecord }) {
  return (
    <header className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm rounded-b-2xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
      {/* Logo and App Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-gray-900 dark:text-white truncate">WebWise AI</span>
      </div>
      {/* Search Query */}
      <div className="flex-1 flex flex-col md:flex-row items-center gap-2 min-w-0">
        <span className="text-base text-gray-700 dark:text-gray-200 font-medium truncate max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl">
          {searchInputRecord?.searchInput}
        </span>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
          <Clock className="h-4 w-4" />
          <span>{formatRelativeTime(searchInputRecord?.created_at)}</span>
        </div>
      </div>
      {/* User/Profile and Actions */}
      <div className="flex items-center gap-3">
        <UserButton />
        <Link href="/" passHref>
          <Button variant="ghost" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            <LinkIcon className="w-4 h-4" /> Home
          </Button>
        </Link>
        <Button variant="ghost" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
          <Send className="w-4 h-4" /> Share
        </Button>
      </div>
    </header>
  );
}

export default Header;