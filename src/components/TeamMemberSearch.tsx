'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'
function TeamMemberSearch({setAllusers,setIsTeamSearchLoading}) {
    const [name,setName]=useState("")
    const handlesearch=async ()=>{
        try {
          if(name) {
            setIsTeamSearchLoading(true)
            const res=await axios.get("/api/users/all")
            console.log(res.data.response);
           
            const result =res.data.response.data.filter(person=>{
              return  `${person.firstName} ${person.lastName}`.toLowerCase().includes(name )
            })
            setAllusers(result)
            setIsTeamSearchLoading(false)
          }else{
            toast.error('Enter a name', {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Slide,
              });

          }
          
        } catch (error) {
            setIsTeamSearchLoading(false)
            console.log(error);
        }finally{
            setIsTeamSearchLoading(false)
        }
    }
  return (
    <div className='flex flex-col justify-center items-center m-5'>
        <h1 className="text-center ">Add Team Member</h1>
    <div className="flex">
    <input value={name} onChange={(e)=>setName(e.target.value)} type="text"  className="input mr-2" placeholder="Search User" list="users" />
    <button className="btn btn-primary" onClick={handlesearch}>Search</button>
    </div>

</div>
  )
}

export default TeamMemberSearch