import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { taskCollection, teammemberCollection } from '@/lib/firebase';
import { doc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

export async function PATCH(req: NextRequest, { params }: { params: { taskId: string } }) {
    const {userId}=await getAuth(req)
    if (!userId) {
     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
   }

  const { taskId } = params;
  const updateData = await req.json();

  if (!taskId) {
    return NextResponse.json({ message: 'Missing task ID' }, { status: 400 });
  }

  try {
    const taskRef = doc(taskCollection, taskId);
   
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    const task = taskSnap.data();
    if (!task) {
      return NextResponse.json({ message: 'Task data is undefined' }, { status: 500 });
    }

    // Step 2: Get project to find teamId
    // const projectSnap = await firestore.collection('projects').doc(task.projectId).get();
    const projectRef = doc(taskCollection, task.projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    const project = projectSnap.data();
    const teamId = project?.teamId;

    // Step 3: Check if user is team owner
    // const teamSnap = await firestore.collection('teams').doc(teamId).get();
    // const team = teamSnap.data();
    const teamRef = doc(taskCollection, teamId);
    const teamSnap = await getDoc(teamRef);
    const team=teamSnap.data()
    const isOwner = team?.ownerId === userId;

    // Step 4: Check if user is a team member
    // const memberSnap = await firestore
    //   .collection('teamMembers')
    //   .where('teamId', '==', teamId)
    //   .where('userId', '==', userId)
    //   .limit(1)
    //   .get();
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
