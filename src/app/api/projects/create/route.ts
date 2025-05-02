import { invitationCollection, projectCollection, teamCollection, teammemberCollection } from "@/lib/firebase";
import { generateJwtToken } from "@/lib/utils";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
       const {userId}=await getAuth(req)
       const user=await currentUser()
       const { name, teamId,description } = await req.json();
       if(!userId){
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
       }
       const user_email=user?.emailAddresses[0].emailAddress
       
       if (!name || !teamId   || !user_email || !description) {
         return NextResponse.json({ message: 'Missing name or teamId' }, { status: 400 });
       }
       const q=query(teammemberCollection,where('team_id','==',teamId),where('user_id','==',userId))
       const teammembersnap=await getDocs(q)
       if(teammembersnap.empty){
        return  NextResponse.json({ message: 'You are not a member of this team' }, { status: 403 });
       }
       await setDoc(doc(projectCollection),{
        name,
        description,
        team_id:teamId,
        creator_id:userId,
        creator_email:user_email,
        createdAt:new Date().toISOString()
      })
      return NextResponse.json({success:true });
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}