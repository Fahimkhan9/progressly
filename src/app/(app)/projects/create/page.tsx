'use client'
import ProjectCreateForm from '@/components/ProjectCreateForm'
import { teamCollection } from '@/lib/firebase'
import { useUser } from '@clerk/nextjs'
import { getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
type team={
    name:string,
    description:string,
    creator_id:string,
    id:string
}

function ProjectCreatePage() {
    const { user } = useUser()
    const [isLoading,setIsLoading]=useState(false)
    const [teams,setTeams]=useState<team[]>([])
    const loadteam = async () => {
        
        
        try {
            
            setIsLoading(true)
            
            if(user?.id){
                console.log('fbk');
                
                const q = query(teamCollection, where('creator_id', "==", user?.id))
            const querySnapshot = await getDocs(q);
            const temp:team[]=[]
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                
                const data={
                    id:doc.id,
                    ...doc.data()
                }
                temp.push(data)
                
              
                
                
            });
            console.log(temp);
            
            if(temp.length>0){
                setTeams(() => temp as team[])
            }
            }
            
            
        } catch (error) {
console.log(error);
setIsLoading(false)
        }finally{
            setIsLoading(false)
        }
    }
    
    useEffect(()=>{
loadteam()
    },[])
    console.log(teams);
    
  return (
    <div className='flex flex-row min-h-screen justify-center items-center'>
        {
            isLoading ? <span className="loading loading-bars loading-xl"></span>:<ProjectCreateForm teams={teams} />
        }
        
    </div>
  )
}

export default ProjectCreatePage