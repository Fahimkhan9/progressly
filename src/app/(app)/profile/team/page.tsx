'use client'
import ProfileSidebar from '@/components/ProfileSidebar'
import TeamModal from '@/components/TeamModal';
import { db, teamCollection } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { CiMenuKebab } from "react-icons/ci";
type team={
    name:string,
    description:string,
    creator_id:string,
    id:string
}

function Page() {
    const { user } = useUser()
    const [teams,setTeams]=useState<team[]>([])
    const [selectedTeam,setSelectedTeam]=useState<team>()
    const [isLoading,setIsLoading]=useState(false)
    const [members,setMembers]=useState([])
    const loadteam = async () => {
        console.log(user);
        
        
        try {
            
            setIsLoading(true)
            const res=await axios.get('/api/users/getteams')
            console.log(res.data);
            
            setTeams(res.data.teams)
            // const q = query(teamCollection, where('creator_id', "==", user?.id))
            // const querySnapshot = await getDocs(q);
            // const temp:team[]=[]
            // querySnapshot.forEach((doc) => {
            //     // doc.data() is never undefined for query doc snapshots
                
            //     const data={
            //         id:doc.id,
            //         ...doc.data()
            //     }
            //     temp.push(data)
                
              
                
                
            // });
            // if(temp.length>0){
            //     setTeams(() => temp as team[])
            // }
            
            
        } catch (error) {
console.log(error);
setIsLoading(false)
        }finally{
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
loadteam()
    }, [])
    const loadteammembers=async(team_id)=>{
                try {
                    
                    console.log(team_id);
                    
                    if(team_id){
                      const data={team_id}
                      const res=await axios.post('/api/users/getmembers',data)
                      console.log(res);
                      console.log(res.data);
                      
                      setMembers(res.data.response)
                    }
                } catch (error) {
                    console.log(error);
                    
                }
            }
    const handleteammodal=(id:string)=>{
        const selectteam=teams.filter(i=>i.id===id)
       
        
        setSelectedTeam(()=>selectteam[0])
        loadteammembers(selectteam[0].id)
        document.getElementById('teammodal').showModal()
    }
    return (
        <div className="flex">
            <div className="w-30 flex-none">
                <ProfileSidebar />
            </div>
            <div className="w-60 flex-1 mx-2">
            {isLoading && <span className="loading loading-ring loading-xl"></span>}
            <div className="overflow-x-auto m-10">
            
  <table className="table">
    {/* head */}
    <thead>
      <tr>
       
        <th>Name</th>
        <th>Description</th>
        

        <th>Action</th>
      </tr>
    </thead>
    <tbody>
    
       
      
        {
            teams.length>0 && teams.map(item=>(
                <tr className="hover:bg-base-300" key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td className='btn' onClick={()=>handleteammodal(item.id)}><CiMenuKebab/></td>
                

                </tr>
            ))
        }
      

     <TeamModal
     team={selectedTeam}
     user={user}
     members={members}
     />
    </tbody>
  </table>
  


</div>
            </div>
        </div>
    )
}

export default Page