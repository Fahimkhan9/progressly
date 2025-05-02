'use client'
import ProjectCreateForm from '@/components/ProjectCreateForm'
import { teamCollection } from '@/lib/firebase'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { getDocs, query, where } from 'firebase/firestore'
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
            console.log(res.data);
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
        <div className='flex flex-row min-h-screen justify-center items-center'>
            {
                isLoading ? <span className="loading loading-bars loading-xl"></span> : <ProjectCreateForm teams={teams} />
            }

        </div>
    )
}

export default ProjectCreatePage