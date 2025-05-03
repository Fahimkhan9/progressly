'use client'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

function ProfileCard() {
    const {user}=useUser()
    
  return (
    <div className="card bg-base-100 w-96 shadow-sm m-5">
  <figure>
  <div className="avatar avatar-online">
  <div className="w-24 rounded-full">
    <img src={user?.imageUrl} alt='user profile picture' />
  </div>
</div>
  </figure>
  <div className="card-body">
    <h2 className="card-title">Name:{`${user?.firstName} ${user?.lastName}`}</h2>
    <h3>Email:{user?.emailAddresses[0].emailAddress}</h3>
    <div className="card-actions">
      <button className="btn bg-[#0c0b52] hover:bg-[#231f84] text-white px-6">
        <Link href='/profile/team/create' >Create team</Link>
        </button>
      
      <button className="btn bg-[#0c0b52] hover:bg-[#231f84] text-white px-6">
      <Link href='/projects/create' >Create project</Link>
      </button>

    </div>
  </div>
</div>
  )
}

export default ProfileCard