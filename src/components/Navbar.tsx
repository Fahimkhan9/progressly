
'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import React, {  useEffect, useState } from 'react'
import { Slide, toast } from 'react-toastify';
import logo from '../assets/logo.png'
import OneSignal from 'react-onesignal';
import NotificationDropdown from './NotificationDropdown';

function Navbar() {
  const [logoutloading,setLogoutLoading]=useState(false)
  const {isSignedIn,isLoaded,user}=useUser()
  const {signOut}=useAuth()

  useEffect(() => {
    async function init() {
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
        notifyButton: {
          enable: true, // shows the bell button
        },
      });

      // Optional: identify the user (must match what you send from backend)
      OneSignal.setExternalUserId(user?.id); // Replace with actual user ID
    }

    init();
  }, []);
  const get=()=>{
    if(!isLoaded){
      return<span className="loading loading-dots loading-md"></span>
    }
    if(!isSignedIn){
      return (
        <>
        <Link href={'/sign-in'}>
        <button className="btn  btn-secondary">Sign in</button></Link>
        </>
      )
    }
    const router=useRouter()
    const handlesignout=async()=>{
      try {
        setLogoutLoading(true)
        await signOut()
        toast.success('Logged out', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
          });
        router.push('/sign-in')
      } catch (error) {
        console.log(error);
        
      }finally{
        setLogoutLoading(false)
      }
    }
    return (
<div className="">
  <NotificationDropdown userId={user.id} />
<div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt={user.username || 'User'}
            src={user.imageUrl} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li className='mb-2 link text-xl'>
          
            <Link href='/profile' >Profile </Link>
            
            
         
        </li>
      
        <li onClick={()=>handlesignout()} >
          <button disabled={logoutloading} className='btn bg-red-800 text-white'>Logout</button>
        </li>
      </ul>
     
    </div>
</div>
    )
  }
  return (
    <div className="navbar  bg-base-100  shadow-sm">
  <div className="flex-1">
    <Link href={'/'}><button className="btn btn-ghost text-xl">
      <img src={logo.src} alt="progressly logo" height={'50px'} width={'100px'} />
      </button></Link>
  </div>
  <div className="flex gap-2 align-center">
    
    {get()}
  </div>
</div>
  )
}

export default Navbar