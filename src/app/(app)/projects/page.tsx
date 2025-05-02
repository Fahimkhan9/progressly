
'use client'
import ProfileSidebar from '@/components/ProfileSidebar'

import { useUser } from '@clerk/nextjs'
import axios from 'axios'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'

function ProjectsPage() {
  const {user}=useUser()
   const [isLoading,setIsLoading]=useState(false)
   const [projects,setProjects]=useState<{ id: string; name: string; creator_id: string; creator_email: string }[]>([])
  const loadproject=async ()=>{
    try {
      setIsLoading(true)
      const res= await axios.get('/api/projects')
   
      setProjects(res.data.projects)
    } catch (error) {
      console.log(error);
      
    }finally{
      setIsLoading(false)
    }
  }
  useEffect(()=>{
    loadproject()
  },[])
  return (
  <div className="flex">
    <div className="w-30 flex-none">
    <ProfileSidebar/>
    </div>
   <div className="w-60 flex-1 mx-5">
   <div className="flex flex-row min-h-screen  justify-center">
     <div className="overflow-x-auto w-full m-5">
  {
    isLoading ? <span className="loading loading-bars loading-xl"></span>:<table className="table">
    {/* head */}
    <thead>
      <tr>
        
        <th>Name</th>
        <th>Owner</th>
        {projects[0]?.creator_id === user?.id && <th>Actions</th>}
      </tr>
    </thead>
    <tbody>
    {
      projects.length>0 && projects.map(item=>(
        <tr key={item.id} className="hover:bg-base-300">
       <td>
       <Link href={`/projects/${item.id}/board`} > {item.name}</Link>
        </td>
        <td>{item.creator_email}</td>
        
        {item?.creator_id === user?.id && <td className='btn bg-[#7C4585] text-white' ><CiMenuKebab/></td>}
      </tr>
      ))
    }
     
     
    </tbody>
  </table>
  }
</div>
   </div>
   </div>
  </div>
  )
}

export default ProjectsPage