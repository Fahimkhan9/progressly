import { taskCollection } from "@/lib/firebase";

import { getAuth } from "@clerk/nextjs/server";
import {  getDocs, orderBy, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest, { params }: { params: { projectId: string } }) {
    try {
       const {userId}=await getAuth(req)
       if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      
      
      const { projectId } = params; 

      if (!projectId) {
        return NextResponse.json({ message: 'Missing projectId' }, { status: 400 });
      }
      const tq=query(taskCollection,where('projectId', '==', projectId),orderBy('order'))
      const tasksSnap=await getDocs(tq)
      const tasks = tasksSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json({ tasks });
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}