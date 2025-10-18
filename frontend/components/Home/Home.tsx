'use client'
import React, { useEffect, useState } from 'react'
import LeftSidebar from './LeftSidebar'
import Feed from './Feed'
import RightSidebar from './RightSidebar'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet'
import { MenuIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import axios from 'axios'
import { BASE_API_URL } from '@/server'
import { handleAuthRequest } from '../utils/apiRequest'
import { setAuthUser } from '@/store/authSlice'
import { redirect } from 'next/navigation'
import { Loader } from 'lucide-react'



const Home = () => {

  const dispatch = useDispatch();
  const user = useSelector((state:RootState) =>state.auth.user);

  const [isLoading , setIsLoading] = useState(false);

  useEffect(() =>{
    const getAuthUser = async() =>{
      const getAuthUserReq = async() =>
        await axios.get(`${BASE_API_URL}/users/me`,{withCredentials:true});
      const result = await handleAuthRequest(getAuthUserReq,setIsLoading);

      if(result){
        dispatch(setAuthUser(result.data.data.user));
      }
    };
    getAuthUser();
  },[dispatch]);

  useEffect(() =>{
    if(!user) return redirect('/auth/login')
  },[user]);

  if(isLoading){
    return (
      <div className='w-full h-screen flex items-center justify-center flex-col'>
         <Loader className='animate-spin' />
      </div> 
    )
  }

  return (
    <div className='flex bg-[#ececec] dark:bg-[#23272f] min-h-screen'>

      <div className='w-[20%] hidden md:block border-r-2 h-screen fixed'>
        <LeftSidebar />
      </div>
     
      <div className='flex-1 md:ml-[20%] max-w-3xl overflow-auto'>
      
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger className='fixed top-3 left-3 z-50 bg-white/80 rounded-full shadow-sm p-1'>
              <MenuIcon className='w-5 h-5 text-primary' />
            </SheetTrigger>
            <SheetContent side='left' className='p-0 w-[80vw] max-w-xs'>
              <SheetTitle className='hidden' />
              <SheetDescription className='hidden' />
             
              <LeftSidebar />
            </SheetContent>
          </Sheet>
          {/* Mount RightSidebar here on mobile so its floating trigger is available */}
          <RightSidebar />
        </div>
        <Feed />
      </div>
     
      <div className='w-[30%] pt-8 px-6 lg:block hidden'>
        <RightSidebar />
      </div>
    </div>
  )
}

export default Home
