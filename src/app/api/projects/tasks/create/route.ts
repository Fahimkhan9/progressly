import { notificationCollection, taskCollection } from "@/lib/firebase";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// CREATE TASK
export async function POST(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      projectId,
      title,
      description,
      status = "todo",
      assignedTo,
      priority = "medium",
      dueDate = null,
      labels = [],
    } = await req.json();

    if (!projectId || !title || !description || !status || !assignedTo) {
      return NextResponse.json(
        { msg: "All required fields missing" },
        { status: 400 }
      );
    }

    // Get assigned user info from Clerk
    const clerkclient = await clerkClient();
    const userlist = await clerkclient.users.getUserList({ userId: assignedTo });
    const assignedUser = userlist.data[0];

    // Create Task
    const taskRef = await addDoc(taskCollection, {
      projectId,
      title,
      description,
      status,
      assignedTo,
      assignedToEmail: assignedUser.emailAddresses[0].emailAddress,
      assignedToImage: assignedUser.imageUrl,
      createdBy: userId,
      createdAt: serverTimestamp(), // ✅ top-level field
      order: Date.now(), // sort
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      labels,
      activity: [
        {
          action: "Task created",
          userId,
          timestamp: new Date(), // ✅ use Date() inside array
        },
      ],
    });

    // Add notification doc
    await addDoc(notificationCollection, {
      userId: assignedTo,
      title: "New Task Assigned",
      message: `You have been assigned: ${title}`,
      read: false,
      createdAt: serverTimestamp(),
      taskId: taskRef.id,
    });

    // Push real-time notification
    await sendNotificationToUser({
      userId: assignedTo,
      title: "New Task Assigned",
      message: `You have been assigned: ${title}`,
    });

    const task = {
      id: taskRef.id,
      projectId,
      title,
      description,
      status,
      assignedTo,
      assignedToEmail: assignedUser.emailAddresses[0].emailAddress,
      assignedToImage: assignedUser.imageUrl,
      createdBy: userId,
      createdAt: new Date().toDateString(),
      order: Date.now(),
      priority,
      dueDate,
      labels,
      activity: [{ action: "Task created", userId, timestamp: new Date() }],
    };

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ msg: error.message }, { status: 500 });
  }
}

// Push Notification to OneSignal
async function sendNotificationToUser({
  userId,
  title,
  message,
}: {
  userId: string;
  title: string;
  message: string;
}) {
  const response = await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
      include_external_user_ids: [userId],
    }),
  });

  return await response.json();
}
