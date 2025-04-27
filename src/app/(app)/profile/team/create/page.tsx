import ProfileSidebar from '@/components/ProfileSidebar'
import TeamCreateForm from '@/components/TeamCreateForm'
import React from 'react'

function CreateTeamPage() {
  return (
    <div className="flex">
        <div className="w-30 flex-none">
            <ProfileSidebar/>
        </div>  
        <div className="w-60 flex-1 mx-2">
            <div className='flex flex-col items-center justify-center '>
                <TeamCreateForm/>
            </div>
        </div>
    </div>
  )
}

export default CreateTeamPage