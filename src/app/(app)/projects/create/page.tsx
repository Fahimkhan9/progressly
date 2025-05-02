'use client'
import ProfileSidebar from '@/components/ProfileSidebar'
import ProjectCreateForm from '@/components/ProjectCreateForm'

import { useUser } from '@clerk/nextjs'
import axios from 'axios'

import React, { useEffect, useState } from 'react'
type team = {
    name: string,
    description: string,
    creator_id: string,
    id: string
}

function ProjectCreatePage() {
    const { user } = useUser()
    const [isLoading, setIsLoading] = useState(false)
    const [teams, setTeams] = useState<team[]>([])
    const loadteam = async () => {


        try {

            setIsLoading(true)


            const res = await axios.get('/api/users/getteams')
         
            setTeams(res.data.owned)






        } catch (error) {
            console.log(error);
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadteam()
    }, [])


    return (
       <div className="flex">
        <div className="w-30 flex-none">
<ProfileSidebar/>
        </div>
        <div className="w-60 flex-1 mx-5">
        <div className='flex flex-row min-h-screen justify-center'>
            {
                isLoading ? <span className="loading loading-bars loading-xl"></span> : <ProjectCreateForm teams={teams} />
            }

        </div>
        </div>
       </div>
    )
}

export default ProjectCreatePage