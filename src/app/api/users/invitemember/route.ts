import { invitationCollection } from "@/lib/firebase";
import { generateJwtToken, sendEmailToInvitedTeamMember } from "@/lib/utils";
import { doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest) {
    try {
        const { email, userid, teamid,role,teamname,teamadminname } = await req.json();
        const token=generateJwtToken({email,userid})
        if([email,userid,teamid,token,role,teamname,teamadminname].some(i=>i.trim()=='')){
            return NextResponse.json({msg:'All fields are required'})
        }
        await sendEmailToInvitedTeamMember(email,teamadminname,teamname,token)
       const docref= await setDoc(doc(invitationCollection),{
            invited_user_email :email,
            sent_by_user_id :userid,
            status :"pending",
            team_id :teamid,
            token,
            createdAt: new Date().toISOString(),
            role
        })
        return NextResponse.json({msg:docref,success:true})
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}