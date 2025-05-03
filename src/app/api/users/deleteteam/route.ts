import { teamCollection } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
try{
const {team_id}=await request.json()
if(!team_id){  
    return NextResponse.json({message:'Invalid teamId'},{status:400})
}
// delete team collection from firebase
const teamCollectionRef = doc(teamCollection, team_id);

await deleteDoc(teamCollectionRef);
return NextResponse.json({success:true},{status:200})
}catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}