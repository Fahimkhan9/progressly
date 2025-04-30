import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
   try {
    const {userId}=await getAuth(req)
    if(!userId){
        return NextResponse.json({msg:"UNAUTOHORIZED"},{status:401})
    }
    const client = await clerkClient();
    const response = await client.users.getUserList();
    return NextResponse.json({response})
   } catch (error:any) {
    return NextResponse.json({msg:error.message},{status:500})
   }
}