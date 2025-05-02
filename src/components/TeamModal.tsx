'use client'
import React, {  useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import TeamMemberSearch from './TeamMemberSearch'
import { IoMdPersonAdd } from "react-icons/io";

import axios from 'axios';
import { Slide, toast } from 'react-toastify';

type team = {
  name: string,
  description: string,
  creator_id: string,
  id: string
}

function TeamModal({ team, user, members, ismemberLoading }:any) {
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
          role
        }
       

         await axios.post('/api/users/invitemember', data)
    
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

  
  return (
    <dialog id="teammodal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">{team?.name}</h3>
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

export default TeamModal