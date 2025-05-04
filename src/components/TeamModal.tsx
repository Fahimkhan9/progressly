'use client'
import React, {  useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import TeamMemberSearch from './TeamMemberSearch'
import { IoMdPersonAdd } from "react-icons/io";

import axios from 'axios';
import { Slide, toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

type team = {
  name: string,
  description: string,
  creator_id: string,
  id: string
}

function TeamModal({ team, user, members, ismemberLoading,setTeams }:any) {
  type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  
  const [allusers, setAllusers] = useState<User[]>([])
  const [isTeamSearchLoading, setIsTeamSearchLoading] = useState(false)
  const [role, setRole] = useState('')
  
  
  const invitemember = async (item: any) => {
    try {
     
      

      if (item.email) {
        const data = {
          email:item.email,
          userid: user.id,
          teamid: team.id,
          role,
          teamname:team.name,
          teamadminname:`${user.firstName} ${user.lastName}`
        }
       

         await axios.post('/api/users/invitemember', data)
        const teammodal = document.getElementById('teammodal') as HTMLDialogElement
        if (teammodal) {
          teammodal.close()
        }
        toast.success('Invitation sent successfully!', {
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

      } else {
        console.log('provide email');
        alert('provide email')
      }


    } catch (error) {
      console.log(error);

    }
  }
const showdeletemodal= ()=>{
 
    const deletemodal=document.getElementById('delete_modal') as HTMLDialogElement
    if(deletemodal){
      deletemodal.showModal()
    }
  
}

  
  return (
    <dialog id="teammodal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{team?.name}</h3>
        <button className='btn bg-red-500' onClick={()=>showdeletemodal()}><FaTrash/></button>
        </div>
        <p className="py-4">{team?.description}</p>


        <div className="overflow-x-auto">
          <h3 className="text-center text-bold">Team Members</h3>
          <table className="table">
            {/* head */}
            <thead>
              <tr>

                <th>Name</th>
                <th>Role</th>
              {team?.creator_id === user?.id && <th>Action</th>}  
              </tr>
            </thead>
            <tbody>
              {ismemberLoading && <span className="loading loading-ring loading-xl"></span>}
              {
                members?.length > 0 && members?.map((item) => (
                  <tr key={item.id} className="hover:bg-base-300">

                    <td>{item.name} </td>
                    <td>{item.role}</td>
                    {team?.creator_id === user?.id && <td className='btn bg-[#7C4585] text-white' ><CiMenuBurger /></td>}
                  </tr>
                ))
              }


            </tbody>
          </table>
        </div>
      
      {team?.creator_id === user?.id &&  <> <TeamMemberSearch
          setAllusers={setAllusers}
          setIsTeamSearchLoading={setIsTeamSearchLoading}
          teamId={team?.id}
        />
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>

                <th>Name</th>
                <th>Role</th>
                <th>Add</th>

              </tr>
            </thead>
            <tbody>
              {isTeamSearchLoading && <span className="loading loading-ring loading-xl"></span>}
              {
                allusers.length === 0 && <tr><td colSpan={3} className='text-center'>No Users Found</td></tr>
              }
              {
                allusers.length > 0 && allusers.map(item => (
                  <tr key={item.id} className="hover:bg-base-300 items-center">

                    <td>{item?.firstName} {item?.lastName}</td>
                    <td>
                      <select onChange={(e) => setRole(e.target.value)
                      } defaultValue="Select Role" className="select select-primary">
                        <option disabled={true}>Select Role</option>
                        <option value='user' >User</option>
                        <option value='admin'>Admin</option>

                      </select>
                    </td>
                    <td className='btn' onClick={() => invitemember(item)}><IoMdPersonAdd /> </td>

                  </tr>
                ))
              }


            </tbody>
          </table>
        </div></>}
      <DeleteConfirmationModal
      team_id={team?.id}
      setTeams={setTeams}
      />
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

const DeleteConfirmationModal=({team_id,setTeams}:{team_id:string,setTeams:any})=>{
  const [isDeleting, setIsDeleting] = useState(false)
  const handleteamdelete=async()=>{
    try {
      setIsDeleting(true)
      const data={team_id}
      console.log(data);
      
      const res=await axios.post('/api/users/deleteteam',data)
      if(res.data.success){
        toast.success('Team deleted successfully!', {
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
      setTeams(prev=>prev.filter(i=>i.id !==team_id))
      const deletemodal=document.getElementById('delete_modal') as HTMLDialogElement
      if(deletemodal){
        deletemodal.close()
      }
      const teammodal=document.getElementById('teammodal') as HTMLDialogElement
      if(teammodal){
        teammodal.close()
      }
      
      }else{
        toast.error('Failed to delete team!', {
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
    <h3 className="font-bold text-lg">Are you sure to delete this team?</h3>
    <button disabled={isDeleting} className="btn my-3 bg-red-500 " onClick={()=>handleteamdelete()}>Delete now</button>
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
export default TeamModal