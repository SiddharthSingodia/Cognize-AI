'use client'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import supabase from '../../../services/superbase.jsx'
import { useEffect } from 'react'
import { useState } from 'react'
import moment from 'moment'
import { SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'





function Library () {
    const {user}=useUser();
    const[libraryHistory,setLibraryHistory]=useState([]);
    const router = useRouter();

    useEffect(() => {
       user&& GetLibraryHistory();
    }, [user]);



    const GetLibraryHistory = async()=>{
        let {data:Library, error}=await supabase.from('Library')
        .select('*')
        .eq('userEmail' , user?.primaryEmailAddress?.emailAddress)
        .order('id',{ascending:false})
        console.log(Library);
        setLibraryHistory(Library);
    }
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted to-transparent dark:from-[#18181b] dark:via-[#23272f] dark:to-transparent pt-24 px-4 md:px-12 lg:px-32 xl:px-64 transition-colors">
      <h2 className="font-geist font-bold text-3xl md:text-4xl text-foreground mb-8 tracking-tight">Your Library</h2>
      <div className="flex flex-col gap-5">
        <AnimatePresence>
          {libraryHistory?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center text-muted-foreground py-16"
            >
              No saved summaries yet.
            </motion.div>
          )}
          {libraryHistory?.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)' }}
              className="group cursor-pointer rounded-2xl bg-white/70 dark:bg-[#23272f]/80 shadow-md hover:shadow-lg transition-all border border-border p-5 flex items-center justify-between gap-4 backdrop-blur-md"
              onClick={() => router.push(`/search/${item.libId}`)}
              tabIndex={0}
              role="button"
              aria-label={`View summary for ${item?.searchInput}`}
            >
              <div>
                <h3 className="font-semibold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors truncate max-w-xs md:max-w-md">{item?.searchInput}</h3>
                <p className="text-xs text-muted-foreground mt-1">{moment(item.created_at).fromNow()}</p>
              </div>
              <SquareArrowOutUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Library 