'use client'
import React, { useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import { IoMdPersonAdd } from 'react-icons/io'
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'
import TeamMemberSearch from './TeamMemberSearch'

interface Team {
  id: string
  name: string
  description: string
  creator_id: string
}

interface Member {
  id: string
  name: string
  role: string
}

interface TeamModalProps {
  team: Team
  user: any
  members: Member[]
  isMemberLoading: boolean
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  imageUrl?: string
}

function TeamModal({ team, user, members, isMemberLoading, setTeams }: TeamModalProps) {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isTeamSearchLoading, setIsTeamSearchLoading] = useState(false)
  const [role, setRole] = useState('user') // default role

  const inviteMember = async (member: User) => {
    try {
      if (!member.email) return

      const data = {
        email: member.email,
        userid: user.id,
        teamid: team.id,
        role,
        teamname: team.name,
        teamadminname: `${user.firstName} ${user.lastName}`,
      }

      await axios.post('/api/users/invitemember', data)

      toast.success('Invitation sent successfully!', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        transition: Slide,
      })

      // Optionally remove invited user from allUsers
      setAllUsers(prev => prev.filter(u => u.id !== member.id))
    } catch (error) {
      console.log(error)
      toast.error('Failed to send invitation', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        transition: Slide,
      })
    }
  }
console.log(allUsers)
  return (
    <dialog id="teammodal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{team.name}</h3>
          <button className="btn bg-red-500">
            <FaTrash />
          </button>
        </div>

        <p className="py-4">{team.description}</p>

        <div className="overflow-x-auto mb-4">
          <h3 className="text-center font-bold mb-2">Team Members</h3>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                {team.creator_id === user?.id && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {isMemberLoading && <span className="loading loading-ring loading-xl"></span>}
              {members.map(member => (
                <tr key={member.id} className="hover:bg-base-300">
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  {team.creator_id === user?.id && (
                    <td className="btn bg-[#7C4585] text-white">
                      <CiMenuBurger />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {team.creator_id === user?.id && (
          <>
            <TeamMemberSearch
              teamId={team.id}
              setAllusers={setAllUsers}
              setIsTeamSearchLoading={setIsTeamSearchLoading}
            />

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Add</th>
                  </tr>
                </thead>
                <tbody>
                  {isTeamSearchLoading && <span className="loading loading-ring loading-xl"></span>}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center">No Users Found</td>
                    </tr>
                  )}
                  {allUsers.map(userItem => (
                    <tr key={userItem.id} className="hover:bg-base-300">
                      <td>{userItem.email}</td>
                      <td>
                        <select
                          onChange={e => setRole(e.target.value)}
                          defaultValue="user"
                          className="select select-primary"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="btn" onClick={() => inviteMember(userItem)}>
                        <IoMdPersonAdd />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}

export default TeamModal
