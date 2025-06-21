'use client'
import React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../../components/ui/sidebar.jsx"
import Image from 'next/image'
import { Compass, GalleryHorizontalEnd, LogIn, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '../../components/ui/button.jsx'
import { SignOutButton, SignUpButton, UserButton, useUser    } from '@clerk/nextjs'


const MenuOptions= [
    {
        title: "Home",
        icon: Search,
        path: "/"
    },
    {
        title: "Discover",
        icon: Compass,
        path: "/discover"
    },
    {
        title: "Library",
        icon: GalleryHorizontalEnd,
        path: "/library"
    },
    {
        title: "Sign In",
        icon: LogIn,
        path: "/sign-in"
    }
    
]

const AppSidebar = () => {
    const path = usePathname();
    const {user} = useUser();
    const filteredMenuOptions = user
      ? MenuOptions.filter(menu => menu.title !== "Sign In")
      : MenuOptions;
    return (
        <Sidebar className='bg-accent'>
          <SidebarHeader  className='bg-accent flex justify-center items-center'>
          <Image src="/logo.png" alt="logo" width={150} height={100} />
          </SidebarHeader>
          <SidebarContent >
            <SidebarGroup >
            <SidebarContent >
                <SidebarMenu>
                    {filteredMenuOptions.map((menu, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild className={` p-5 py-6 hover:bg-accent/50 hover:font-bold
                                // to highlight current selected buttton acc to the path
                                ${path?.includes(menu.path) && 'font-bold'} `}>
                                    <a href ={menu.path} className=''>
                                    <menu.icon className='w-6 h-6  '/>
                                    <span className='text-lg '>{menu.title}</span>

                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

             {!user ?  <SignUpButton mode='modal'>
                <Button className='rounded-full w-full'>
                    Sign up
                   </Button>
                   </SignUpButton>
                   :
                   <SignOutButton>
                   <Button className='rounded-full w-full'>
                    Sign Out
                   </Button>
                   </SignOutButton>
                   }

            </SidebarContent>
            </SidebarGroup>
            <SidebarGroup />
          </SidebarContent>
          <SidebarFooter className='bg-accent'>
           <div className='p-3 flex flex-col gap-3'>
            <h2 className='text-gray-500 '>Try Now</h2>
            <p className='text-gray-400 '>Upgrade for image upload, smarter AI, and more</p>
            <Button variant ={'secondary'} className={'text-gray-500'}>Learn More</Button>
            <UserButton />
           </div>
          
          </SidebarFooter>
        </Sidebar>
      )
}

export default AppSidebar