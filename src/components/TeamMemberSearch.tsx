'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
function TeamMemberSearch({setAllusers}) {
    
    const handlesearch=async ()=>{
        try {
            const res=await axios.get("/api/users/all")
            console.log(res.data.response);
            setAllusers(()=>res.data.response.data)
        } catch (error) {
            
        }
    }
  return (
    <div className='flex flex-col justify-center items-center m-5'>
        <h1 className="text-center ">Add Team Member</h1>
    <div className="flex">
    <input type="text" className="input mr-2" placeholder="Search User" list="users" />
    <button className="btn btn-primary" onClick={handlesearch}>Search</button>
    </div>

</div>
  )
}

export default TeamMemberSearch