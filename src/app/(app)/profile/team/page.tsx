'use client'
import ProfileSidebar from '@/components/ProfileSidebar'
import { db, teamCollection } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import { doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

type team={
    name:string,
    description:string,
    creator_id:string,
    id:string
}

function Page() {
    const { user } = useUser()
    const [teams,setTeams]=useState()
    const loadteam = async () => {
        console.log('run');
        
        try {
            
            console.log(user);
            
            const q = query(teamCollection, where('creator_id', "==", user?.id))
            const querySnapshot = await getDocs(q);
            const temp=[]
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                
                const data={
                    id:doc.id,
                    ...doc.data()
                }
                temp.push(data)
                
              
                
                
            });
            console.log(temp);
            
            
        } catch (error) {
console.log(error);

        }
    }
    useEffect(() => {
loadteam()
    }, [])
    
    
    return (
        <div className="flex">
            <div className="w-30 flex-none">
                <ProfileSidebar />
            </div>
            <div className="w-60 flex-1 mx-2">
                <div className='flex flex-col items-center justify-center mt-5 '>
                    <ul className="list bg-base-100 rounded-box shadow-md">

                        <li className="p-4 pb-2 text-xs opacity-100 tracking-wide"></li>

                        <li className="list-row">

                            <div>
                                <div>Dio Lupa</div>

                            </div>
                            <p className="list-col-wrap text-xs">
                                "Remaining Reason" became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition, making it one of Dio Lupa’s most iconic tracks.
                            </p>
                            <button className="btn btn-square btn-ghost">
                                <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                            </button>
                            <button className="btn btn-square btn-ghost">
                                <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
                            </button>
                        </li>



                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Page