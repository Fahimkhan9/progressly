import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { projectCollection, taskCollection, teammemberCollection } from '@/lib/firebase';
import { doc, getDoc, getDocs, query, where, updateDoc, orderBy } from 'firebase/firestore';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const {userId}=await getAuth(req)
    if (!userId) {
     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
   }

  const { id } = params;
  const updateData = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'Missing task ID' }, { status: 400 });
  }

  try {
    const taskRef = doc(taskCollection, id);
   
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    const task = taskSnap.data();
    if (!task) {
      return NextResponse.json({ message: 'Task data is undefined' }, { status: 500 });
    }

    
    const projectRef = doc(projectCollection, task.projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    const project = projectSnap.data();
    const teamId = project?.team_id;

    
    const teamRef = doc(taskCollection, teamId);
    const teamSnap = await getDoc(teamRef);
    const team=teamSnap.data()
    const isOwner = team?.creator_id === userId;

    
const mq=query(teammemberCollection,where('team_id', '==', teamId),where('user_id', '==', userId))  
const memberSnap = await getDocs(mq);
    const isMember = !memberSnap.empty;

    if (!isOwner && !isMember) {
      return NextResponse.json({ message: 'Access denied: Not a team member' }, { status: 403 });
    }

    // Step 5: Sanitize allowed fields
    const allowedFields = ['title', 'description', 'status', 'order', 'assignedTo'];
    const filteredUpdate: Record<string, any> = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
      }
    }

    await updateDoc(taskRef, filteredUpdate);

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
export async function GET(req:NextRequest, { params }: { params: { id: string } }) {
    try {
       const {userId}=await getAuth(req)
       if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    
      
      const { id} = params; 

      if (!id) {
        return NextResponse.json({ message: 'Missing projectId' }, { status: 400 });
      }
      const tq=query(taskCollection,where('projectId', '==', id),orderBy('order'))
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