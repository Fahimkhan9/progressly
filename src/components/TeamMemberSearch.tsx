'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'

interface TeamMemberSearchProps {
  setAllusers: React.Dispatch<React.SetStateAction<any[]>>
  setIsTeamSearchLoading: React.Dispatch<React.SetStateAction<boolean>>
  teamId: string
}

const TeamMemberSearch = ({ setAllusers, setIsTeamSearchLoading, teamId }: TeamMemberSearchProps) => {
  const [name, setName] = useState('')

  const handleSearch = async () => {
    if (!name.trim()) {
      toast.error('Enter a name', {
        position: 'bottom-left',
        autoClose: 5000,
        theme: 'colored',
        transition: Slide,
      })
      return
    }

    try {
      setIsTeamSearchLoading(true)

      // Send GET request to your updated backend
      const res = await axios.get(`/api/users/getnonmembers/${teamId}`)

      // res.data.response should already be an array from your backend

      const users = Array.isArray(res.data.response) ? res.data.response : []

      // Filter by name in frontend
      

      setAllusers(users)
    } catch (error) {
      console.log(error)
      setAllusers([])
    } finally {
      setIsTeamSearchLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center m-5">
      <h1 className="text-center font-bold mb-2">Add Team Member</h1>
      <div className="flex mt-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          className="input mr-2"
          placeholder="Search User"
        />
        <button className="btn bg-[#7C4585] text-white" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  )
}

export default TeamMemberSearch
