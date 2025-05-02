

import { teamCollection, teammemberCollection } from "@/lib/firebase";
import { clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
   try {
    const {userId}=await getAuth(req)
    const {name,description}=await req.json()
    const user=await currentUser()
    const user_email=user?.emailAddresses[0].emailAddress
    if([name,description].some(i=>i.trim()=='')){
        return NextResponse.json({msg:"All fields are required"},{status:400})
    }
    if(!userId){
        return NextResponse.json({msg:"UNAUTOHORIZED"},{status:401})
    }
    const ref=await addDoc(teamCollection,{
        name,
        description,
        creator_id:userId,
        creator_email:user_email
      })
      await setDoc(doc(teammemberCollection),{
        team_id:ref.id,
        user_id:userId,
        role:'admin',
        joinedAt:new Date().toISOString()
      })
      return NextResponse.json({ id: ref.id, name,success:true });
   } catch (error:any) {
    return NextResponse.json({msg:error.message},{status:500})
   }
}