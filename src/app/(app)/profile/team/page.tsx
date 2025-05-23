'use client'
import ProfileSidebar from '@/components/ProfileSidebar'
import TeamModal from '@/components/TeamModal';

import { useUser } from '@clerk/nextjs';
import axios from 'axios';

import React, { useEffect, useState } from 'react'

import { FaEye } from "react-icons/fa";
type team = {
    name: string,
    description: string,
    creator_id: string,
    id: string
}

function Page() {
    const { user } = useUser()
    const [teams, setTeams] = useState<team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<team>()
    const [isLoading, setIsLoading] = useState(false)
    const [ismemberLoading, setIsMemberLoading] = useState(false)
    const [members, setMembers] = useState([])
     const loadteam = async () => {



        try {

            setIsLoading(true)
            const res = await axios.get('/api/users/getteams')

            setTeams(res.data.teams)



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
    const loadteammembers = async (team_id:string) => {
        try {
            setIsMemberLoading(true)


            if (team_id) {
                const data = { team_id }
                const res = await axios.post('/api/users/getmembersofteam', data)



                setMembers(res.data.response)
                setIsMemberLoading(false)
            }
        } catch (error) {
            console.log(error);
            setIsMemberLoading(false)
        } finally {
            setIsMemberLoading(false)
        }
    }
    const handleteammodal = (id: string) => {
        const selectteam = teams.filter(i => i.id === id)


        setSelectedTeam(() => selectteam[0])
        
        
        loadteammembers(selectteam[0].id)
        const modal = document.getElementById('teammodal') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }
    return (
        <div className="flex">
            <div className="w-30 flex-none">
                <ProfileSidebar />
            </div>
            <div className="w-60 flex-1 mx-2">
                {isLoading && <span className="loading loading-ring loading-xl"></span>}
                <div className="overflow-x-auto m-10">

                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>

                                <th>Name</th>
                                <th>Description</th>


                                <th>Details</th>
                               

                            </tr>
                        </thead>
                        <tbody>



                            {
                                teams.length > 0 && teams.map(item => (
                                    <tr className="hover:bg-base-300" key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td className='btn' onClick={() => handleteammodal(item.id)}><FaEye /></td>
                                        

                                    </tr>
                                ))
                            }


                            <TeamModal
                                team={selectedTeam}
                                user={user}
                                members={members}
                                ismemberLoading={ismemberLoading}
                                setTeams={setTeams}
                            />
                        </tbody>
                    </table>



                </div>
            </div>
        </div>
    )
}

export default Page
