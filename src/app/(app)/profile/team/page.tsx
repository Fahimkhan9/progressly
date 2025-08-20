'use client'

import React, { useEffect, useState } from 'react'
import ProfileSidebar from '@/components/ProfileSidebar'
import TeamModal from '@/components/TeamModal'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { FaEye } from 'react-icons/fa'

type Team = {
  id: string
  name: string
  description: string
  creator_id: string
}

type Member = {
  id: string
  name: string
  role: string
}

function Page() {
  const { user } = useUser()
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isMemberLoading, setIsMemberLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])

  // Load all teams
  const loadTeams = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get('/api/users/getteams')
      setTeams(res.data.teams)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load team members
  const loadTeamMembers = async (team_id: string) => {
    try {
      setIsMemberLoading(true)
      if (!team_id) return

      const res = await axios.post('/api/users/getmembersofteam', { team_id })
      setMembers(res.data.response)
    } catch (error) {
      console.log(error)
    } finally {
      setIsMemberLoading(false)
    }
  }

  // Open team modal
  const handleTeamModal = (id: string) => {
    const team = teams.find(i => i.id === id)
    if (!team) return

    setSelectedTeam(team)
    loadTeamMembers(team.id)

    const modal = document.getElementById('teammodal') as HTMLDialogElement
    if (modal) modal.showModal()
  }

  useEffect(() => {
    loadTeams()
  }, [])

  return (
    <div className="flex min-h-screen">
      <div className="w-30 flex-none">
        <ProfileSidebar />
      </div>

      <div className="w-60 flex-1 mx-2">
        {isLoading && <span className="loading loading-ring loading-xl"></span>}

        <div className="overflow-x-auto m-10">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {teams.length > 0 ? (
                teams.map(team => (
                  <tr key={team.id} className="hover:bg-base-300">
                    <td>{team.name}</td>
                    <td>{team.description}</td>
                    <td>
                      <button className="btn" onClick={() => handleTeamModal(team.id)}>
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    No teams found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeam && (
        <TeamModal
          team={selectedTeam}
          user={user}
          members={members}
          isMemberLoading={isMemberLoading}
          setTeams={setTeams}
        />
      )}
    </div>
  )
}

export default Page
