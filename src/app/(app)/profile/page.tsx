import ProfileCard from '@/components/ProfileCard'
import ProfileSidebar from '@/components/ProfileSidebar'
import React from 'react'

function ProfilePage() {
  return (
    <div className="flex">
        <div className="w-30 flex-none">
            <ProfileSidebar/>
        </div>  
        <div className="w-60 flex-1 mx-2">
            <div className='flex flex-col items-center justify-center '>
                <ProfileCard/>
            </div>
        </div>
    </div>
  )
}

export default ProfilePage