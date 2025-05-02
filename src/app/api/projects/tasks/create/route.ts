
import { invitationCollection, projectCollection, taskCollection, teamCollection, teammemberCollection } from "@/lib/firebase";
import { generateJwtToken } from "@/lib/utils";
import { getAuth } from "@clerk/nextjs/server";
import { addDoc, doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
       const {userId}=await getAuth(req)
       if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      const { projectId, title, description, status = 'todo', assignedTo } = await req.json();
      if(!projectId || !title || !description || !status || !assignedTo) {
        return NextResponse.json({msg:"All fields are required"},{status:400})
      }
      const taskRef = await addDoc(taskCollection,{
        projectId,
        title,
        description: description,
        status,
        assignedTo: assignedTo,
        createdBy: userId,
        createdAt: new Date().toDateString(),
        order: Date.now(), // simple sort by timestamp
      })
      return NextResponse.json({ id: taskRef.id });
      
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}