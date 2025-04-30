import { invitationCollection, teamCollection } from "@/lib/firebase";
import { generateJwtToken } from "@/lib/utils";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        const { email, userid, teamid,role } = await req.json();
        const token=generateJwtToken({email,userid})
        if([email,userid,teamid,token].some(i=>i.trim()=='')){
            return NextResponse.json({msg:'All fields are required'})
        }
       const docref= await setDoc(doc(invitationCollection),{
            invited_user_email :email,
            sent_by_user_id :userid,
            status :"pending",
            team_id :teamid,
            token,
            createdAt: new Date(),
            role
        })
        return NextResponse.json({msg:docref,success:true})
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}