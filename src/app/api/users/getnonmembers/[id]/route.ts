import {  clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import {  teammemberCollection } from '@/lib/firebase'; // Your Firestore config
import {  getDocs, query, where } from 'firebase/firestore';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
     const {userId}=await getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {id} =params;


    //  Get current team members
   
    const mq=query(teammemberCollection,where('team_id','==',id))
    const memberSnapshot = await getDocs(mq);
    const memberIds = memberSnapshot.docs.map(doc => doc.data().user_id);
   
    // Step 2: Get all users from Clerk
    const client = await clerkClient();
    const allUsers = await client.users.getUserList();

    // Step 3: Filter out current members
    const nonMembers = allUsers.data.filter(user => !memberIds.includes(user.id));

    // Optional: Map to only the fields you want to expose
    const response = nonMembers.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses?.[0]?.emailAddress,
      imageUrl: user.imageUrl,
    }));

    
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('[GET_NON_TEAM_MEMBERS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch non-members' }, { status: 500 });
  }
}
