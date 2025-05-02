import { invitationCollection, teamCollection, teammemberCollection } from "@/lib/firebase";
import { generateJwtToken } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";
import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        const {team_id}=await req.json()
        const clerkclient =await  clerkClient();
        
        if (!team_id) {
            return NextResponse.json({ message: 'Invalid teamId' }, { status: 400 });
          }
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
          console.log(members);
          
    //    const response= userIds.map(user=>{
    //         return userlist.data.filter(i => i.id === user.user_id);
            
    //     })
        
        
        
        return NextResponse.json({response:members},{status:200})
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}