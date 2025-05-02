
'use client'
import { projectCollection } from '@/lib/firebase'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'

function ProjectsPage() {
  const {user,isLoaded}=useUser()
   const [isLoading,setIsLoading]=useState(false)
   const [projects,setProjects]=useState([])
  const loadproject=async ()=>{
    try {
      setIsLoading(true)
      const res= await axios.get('/api/projects')
      console.log(res.data.projects);
      
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
   <div className="flex flex-row min-h-screen  justify-center">
     <div className="overflow-x-auto w-full m-5">
  {
    isLoading ? <span className="loading loading-bars loading-xl"></span>:<table className="table">
    {/* head */}
    <thead>
      <tr>
        
        <th>Name</th>
        <th>Owner</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
    {
      projects.length>0 && projects.map(item=>(
        <tr key={item.id} className="hover:bg-base-300">
       <td>{item.name}</td>
        <td>{item.creator_email}</td>
        
        <td className='btn btn-secondary' ><CiMenuKebab/></td>
      </tr>
      ))
    }
     
     
    </tbody>
  </table>
  }
</div>
   </div>
  )
}

export default ProjectsPage