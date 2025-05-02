import { invitationCollection, projectCollection, teamCollection, teammemberCollection } from "@/lib/firebase";
import { generateJwtToken } from "@/lib/utils";
import { getAuth } from "@clerk/nextjs/server";
import { doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    try {
       const {userId}=await getAuth(req)
       if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const q=query(teammemberCollection,where("user_id",'==',userId))
      const membersnap=await getDocs(q)
      const teamIds = membersnap.docs.map(doc => doc.data().team_id);
      if (teamIds.length === 0) {
        return NextResponse.json({ projects: [] });
      }
      const pq=query(projectCollection,where('team_id', 'in', teamIds.slice(0, 10)),orderBy('createdAt', 'desc'))
      const projectsnap=await getDocs(pq)
      const projects = projectsnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
   
      return NextResponse.json({ projects });
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}