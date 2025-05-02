'use client'
import React, { useEffect, useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import TeamMemberSearch from './TeamMemberSearch'
import { IoMdPersonAdd } from "react-icons/io";
import { doc, setDoc } from 'firebase/firestore';
import { invitationCollection } from '@/lib/firebase';
import axios from 'axios';

type team={
    name:string,
    description:string,
    creator_id:string,
    id:string
}
type props={
    team:team,
    
}
function TeamModal({team,user,members,ismemberLoading}) {
    const [allusers,setAllusers]=useState([])
    
    const [role,setRole]=useState('')
    const invitemember=async (item)=>{
        try {
            
            const email=item.emailAddresses[0].emailAddress
            console.log(role);
            
            if(email){
                const data={
                    email,
                    userid:user.id,
                    teamid:team.id,
                    role
                }
                console.log(data);
                
                const res=await axios.post('/api/users/invitemember',data)
                console.log(res);
                
            }else{
                console.log('provide email');
                
            }
           
            
        } catch (error) {
            console.log(error);
            
        }
    }
    
    
    console.log(members);
    
  return (
    <dialog id="teammodal" className="modal">
  <div className="modal-box w-11/12 max-w-5xl">
    <h3 className="font-bold text-lg">{team?.name}</h3>
    <p className="py-4">{team?.description}</p>
    
    
    <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        
        <th>Name</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {ismemberLoading && <span className="loading loading-ring loading-xl"></span>}
     {
      members?.length>0 && members?.map(item=>(
<tr key={item.id}  className="hover:bg-base-300">
      
      <td>{item.name} </td>
      <td>{item.role}</td>
      <td className='btn btn-secondary' ><CiMenuBurger/></td>
    </tr>
      ))
     }
      
   
    </tbody>
  </table>
</div>
<TeamMemberSearch
setAllusers={setAllusers}
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
      {
        allusers.length>0 && allusers.map(item=>(
            <tr key={item.id} className="hover:bg-base-300 items-center">
            
            <td>{item?.firstName} {item?.lastName}</td>
            <td>
            <select onChange={(e)=>setRole(e.target.value)
            } defaultValue="Select Role" className="select select-primary">
  <option disabled={true}>Select Role</option>
  <option value='user' >User</option>
  <option value='admin'>Admin</option>
  
</select>
            </td>
            <td className='btn' onClick={()=>invitemember(item)}><IoMdPersonAdd/> </td>
           
          </tr>
        ))
      }
   
    
    </tbody>
  </table>
</div>
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