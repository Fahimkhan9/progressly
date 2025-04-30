import { invitationCollection, teamCollection, teammemberCollection } from "@/lib/firebase";
import { generateJwtToken } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";
import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        const {team_id}=await req.json()
        const clerkclient =await  clerkClient();
        const userlist = await clerkclient.users.getUserList();
        if (!team_id) {
            return NextResponse.json({ message: 'Invalid teamId' }, { status: 400 });
          }
        const q=query(teammemberCollection,where('team_id','==',team_id))
        const teammembersnap=await getDocs(q)
        const memberdata=teammembersnap.docs.map(doc => doc.data());
        const userIds = memberdata.map(m => {
            return {user_id:m.user_id,role:m.role}
        });
       
       const response= userIds.map(user=>{
            return userlist.data.filter(i => i.id === user.user_id);
            
        })
        console.log(response);
        
        
        return NextResponse.json({response},{status:200})
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}