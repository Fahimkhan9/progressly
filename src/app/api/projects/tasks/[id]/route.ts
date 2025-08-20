import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient as _clerkClient } from "@clerk/nextjs/server";
import {
  projectCollection,
  taskCollection,
  teammemberCollection,
  teamCollection
} from '@/lib/firebase';
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  orderBy,
  Timestamp
} from 'firebase/firestore';

export async function PATCH(req: NextRequest, { params }: any) {
  const { userId } = await getAuth(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const updateData = await req.json();
  if (!id) return NextResponse.json({ message: 'Missing task ID' }, { status: 400 });

  try {
    const taskRef = doc(taskCollection, id);
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    const task = taskSnap.data();
    if (!task) return NextResponse.json({ message: 'Task data is undefined' }, { status: 500 });

    // Check project & team membership
    const projectRef = doc(projectCollection, task.projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    const project = projectSnap.data();
    const teamId = project?.team_id;

    const teamRef = doc(teamCollection, teamId);
    const teamSnap = await getDoc(teamRef);
    const team = teamSnap.data();
    const isOwner = team?.creator_id === userId;

    const mq = query(teammemberCollection, where('team_id', '==', teamId), where('user_id', '==', userId));
    const memberSnap = await getDocs(mq);
    const isMember = !memberSnap.empty;
    if (!isOwner && !isMember) return NextResponse.json({ message: 'Access denied: Not a team member' }, { status: 403 });

    // Allowed fields to update
    const allowedFields = ['title', 'description', 'status', 'order', 'assignedTo', 'priority', 'dueDate', 'labels'];
    const filteredUpdate: Record<string, any> = {};
    const changedFields: string[] = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
        changedFields.push(field);
      }
    }

    // Create a new activity entry
    const clerk = await _clerkClient();
    const user = await clerk.users.getUser(userId);

    const updateActivity = {
      action: changedFields.length
        ? `Task updated (${changedFields.join(', ')})`
        : 'Task updated',
      userId,
      timestamp: Timestamp.fromDate(new Date()),
      user: {
        id: user.id,
        name: user.firstName + (user.lastName ? ` ${user.lastName}` : ''),
        email: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl || null,
      },
    };

    // Add to Firestore
    await updateDoc(taskRef, {
      ...filteredUpdate,
      activity: arrayUnion(updateActivity),
    });

    return NextResponse.json({ message: 'Task updated successfully' });

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET tasks
export async function GET(req: NextRequest, { params }: any) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ message: 'Missing projectId' }, { status: 400 });

    const myTasksOnly = req.nextUrl.searchParams.get('myTasks') === 'true';

    // Fetch tasks
    let tq;
    if (myTasksOnly) {
      tq = query(taskCollection, where('projectId', '==', id), where('assignedTo', '==', userId), orderBy('order'));
    } else {
      tq = query(taskCollection, where('projectId', '==', id), orderBy('order'));
    }

    const tasksSnap = await getDocs(tq);
    const tasksRaw = tasksSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Collect unique userIds from activity arrays
    const userIds = new Set<string>();
    tasksRaw.forEach(task => {
      task.activity?.forEach((act: any) => {
        if (act.userId) userIds.add(act.userId);
      });
    });

    // Fetch user info from Clerk
    const usersMap: Record<string, any> = {};
    if (userIds.size > 0) {
      const clerk = await _clerkClient();
      const userList = await clerk.users.getUserList({ userId: Array.from(userIds) });
      userList.data.forEach(u => {
        usersMap[u.id] = {
          id: u.id,
          name: u.firstName + (u.lastName ? ` ${u.lastName}` : ''),
          email: u.emailAddresses[0]?.emailAddress || '',
          imageUrl: u.imageUrl || null,
        };
      });
    }

    // Replace activity.userId with full user info
    const tasks = tasksRaw.map(task => ({
      ...task,
      activity: task.activity?.map((act: any) => ({
        ...act,
        user: act.userId ? usersMap[act.userId] || { id: act.userId } : null,
      })),
    }));

    return NextResponse.json({ tasks });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ msg: error.message }, { status: 500 });
  }
}
