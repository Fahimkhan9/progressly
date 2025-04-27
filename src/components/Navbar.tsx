
'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import React, { useEffect } from 'react'

function Navbar() {
  const {isSignedIn,isLoaded,user}=useUser()
  const {signOut}=useAuth()
  console.log(user);
  const get=()=>{
    if(!isLoaded){
      return<span className="loading loading-dots loading-md"></span>
    }
    if(!isSignedIn){
      return <button className="btn">Signin</button>
    }
    const router=useRouter()
    const handlesignout=async()=>{
      try {
        await signOut()
        router.push('/sign-in')
      } catch (error) {
        console.log(error);
        
      }
    }
    return (
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
        <li>
          
            <Link href='/profile' >Profile </Link>
            
            
         
        </li>
        <li>Settings</li>
        <li onClick={()=>handlesignout()} >
          <button className='btn bg-red-300'>Logout</button>
        </li>
      </ul>
    </div>
    )
  }
  return (
    <div className="navbar  bg-base-300 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="flex gap-2">
    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    {get()}
  </div>
</div>
  )
}

export default Navbar