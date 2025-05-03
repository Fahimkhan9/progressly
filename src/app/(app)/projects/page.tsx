
'use client'
import ProfileSidebar from '@/components/ProfileSidebar'

import { useUser } from '@clerk/nextjs'
import axios from 'axios'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import { CiMenuKebab } from 'react-icons/ci'
import { Slide, toast } from 'react-toastify'

function ProjectsPage() {
  const {user}=useUser()
   const [isLoading,setIsLoading]=useState(false)
   const [projectId,setProjectId]=useState('')
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
  const showdeletemodal= async (id:string)=>{
setProjectId(id)
    const deletemodal=document.getElementById('delete_modal') as HTMLDialogElement
    if(deletemodal){
      deletemodal.showModal()
    }
    
  }
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
        <tr  key={item.id} className="hover:bg-base-300">
       <td className='link text-xl'>
       <Link href={`/projects/${item.id}/board`} > {item.name}</Link>
        </td>
        <td className=' text-xl'>{item.creator_email}</td>
        
        {item?.creator_id === user?.id && <td onClick={()=>showdeletemodal(item?.id)} className='btn bg-[#7C4585] text-white' ><CiMenuKebab/></td>}
      </tr>
      ))
    }
        
   <ProjectDeleteConfirmation
   id={projectId}
   setProjects={setProjects}
   />
    </tbody>
  </table>
  }
</div>
   </div>
   </div>
  </div>
  )
}

const ProjectDeleteConfirmation=({id,setProjects}:any)=>{
  const [isDeleting,setIsDeleting]=useState(false)
  const handleprojectdelete=async()=>{
    try {
      setIsDeleting(true)
      const data={id}
      console.log(data);
      
      const res=await axios.post('/api/projects/delete',data)
      if(res.data.success){
        setProjects((prev:any)=>prev.filter((item:any)=>item.id !== id))
       toast.success('Project deleted successfully!', {
                 position: "top-right",
                 autoClose: 5000,
                 hideProgressBar: false,
                 closeOnClick: false,
                 pauseOnHover: true,
                 draggable: true,
                 progress: undefined,
                 theme: "colored",
                 transition: Slide,
             });
        const deletemodal=document.getElementById('delete_modal') as HTMLDialogElement
        if(deletemodal){
          deletemodal.close()
        }
      }else{
        toast.error('Failed to delete project!', {
          position: "top-right",
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
      console.log(error);
      
    }finally{
      setIsDeleting(false)
    }
  }
  return (
    <dialog id="delete_modal" className="modal">
  <div className="modal-box ">
    <div className='flex flex-col justify-center items-center'>
    <h3 className="font-bold text-lg">Are you sure to delete this project?</h3>
    <button disabled={isDeleting} className="btn my-3 bg-red-500 " onClick={()=>handleprojectdelete()}>Delete now</button>
    </div>
    
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
  )
}

export default ProjectsPage