import {  projectCollection, teamCollection, teammemberCollection } from "@/lib/firebase";

import { clerkClient } from "@clerk/nextjs/server";
import {  doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        const {projectId}=await req.json()
        const clerkclient =await  clerkClient();
       
        
        if (!projectId) {
            return NextResponse.json({ message: 'Invalid projectId' }, { status: 400 });
          }
          const pq=doc(projectCollection,projectId)
          const projectSnap = await getDoc(pq);
          const projectData = projectSnap.exists() ? projectSnap.data() : [];
          const team_id = projectData?.team_id
        const q=query(teammemberCollection,where('team_id','==',team_id))
        const teammembersnap=await getDocs(q)
        const memberdata=teammembersnap.docs.map(doc => doc.data());
        const userIds = memberdata.map(m => {
           
            return m.user_id
        });
        
        
        const users = await clerkclient.users.getUserList({userId:userIds});
        const members = users.data.map(user => {
            const memberMeta = memberdata.find(m => m.user_id === user.id);
            return {
              id: user.id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              email: user.emailAddresses?.[0]?.emailAddress || '',
              role: memberMeta?.role || 'user',
              joinedAt: memberMeta?.joinedAt || null,
            };
          });
         
   
        
        
        
        return NextResponse.json({response:members,projectData},{status:200})
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}