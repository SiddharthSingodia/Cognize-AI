'use client'
import React, { useEffect, useState }  from 'react'
import { useUser } from '@clerk/nextjs'
import supabase from '../services/superbase.jsx'
import { UserDetailContext } from '../context/UserDetailContext'

  

function Provider({children}) {
    const{user} = useUser();
    const [userDetail, setUserDetail] = useState(null)
    useEffect(()=>{
        user && CreateNewUser()
    },[user])
    const CreateNewUser=async()=>{
        //if already exists, do nothing
        
let { data: Users, error } = await supabase
.from('Users')
.select('*')
.eq('email', user?.primaryEmailAddress?.emailAddress)
console.log(Users)


  if(Users.length===0){
   
const { data, error } = await supabase  //inserting new user
.from('Users')
.insert([
  { 
    name: user?.fullName,
    email: user?.primaryEmailAddress?.emailAddress,
    
  },
])
.select()
   
    setUserDetail(data[0]);
    return;
         }
        setUserDetail(Users[0]);
    }
  return (

    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
    <div className='w-full'>
        {children}
    </div></UserDetailContext.Provider>
   
  )
}

export default Provider