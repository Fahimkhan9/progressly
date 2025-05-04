
import {  notificationCollection, taskCollection } from "@/lib/firebase";

import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp, } from "firebase/firestore";
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
      const clerkclient=await clerkClient()
      const userlist =await clerkclient.users.getUserList({userId:assignedTo})
      
      
      const taskRef = await addDoc(taskCollection,{
        projectId,
        title,
        description: description,
        status,
        assignedTo: assignedTo,
        assignedToEmail: userlist.data[0].emailAddresses[0].emailAddress,
        assggnedToImage:userlist.data[0].imageUrl,
        createdBy: userId,
        createdAt: new Date().toDateString(),
        order: Date.now(), // simple sort by timestamp
      })
      await addDoc(notificationCollection,{
        userId: assignedTo,
        title: 'New Task Assigned',
        message: `You have been assigned: ${title}`,
        read: false,
        createdAt: serverTimestamp(),
        taskId: taskRef.id,
      })
    await sendNotificationToUser({
        userId: assignedTo,
        title: 'New Task Assigned',
        message: `You have been assigned: ${title}`,
      });
    
      const task={
        projectId,
        title,
        description: description,
        status,
        assignedTo: assignedTo,
        assignedToEmail: userlist.data[0].emailAddresses[0].emailAddress,
        assggnedToImage:userlist.data[0].imageUrl,
        createdBy: userId,
        createdAt: new Date().toDateString(),
        order: Date.now(), 
      }
      return NextResponse.json({ id: taskRef.id,task }, { status: 201 });
      
    } catch (error:any) {
        return NextResponse.json({msg:error.message},{status:500})
    }
}
async function sendNotificationToUser({
  userId,
  title,
  message,
}: {
  userId: string;
  title: string;
  message: string;
}) {
  const response = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
      include_external_user_ids: [userId], // Clerk user ID (you must map this in OneSignal setup)
    }),
  });

  return await response.json();
}
