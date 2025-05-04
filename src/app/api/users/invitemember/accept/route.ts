import {  invitationCollection, teammemberCollection } from "@/lib/firebase";

import { currentUser, getAuth } from "@clerk/nextjs/server";
import {  doc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) {
      return NextResponse.json({ msg: 'token is required' }, { status: 400 })
    }
    const { userId } = await getAuth(req)
    const user = await currentUser()
    const userEmail = user?.emailAddresses[0].emailAddress
   

    if (!userId) {
      return NextResponse.json({ msg: 'UNAUTHORIZED',success:false  }, { status: 401 })
    }

    const q = query(invitationCollection, where('token', '==', token), limit(1))
    const invitationSnap = await getDocs(q)

    if (invitationSnap.empty) {
      return NextResponse.json({ msg: 'Invalid invitation token',success:false  }, { status: 400 })
    }
    const invitationDoc = invitationSnap.docs[0];
    const invitation = invitationDoc.data();
    if (invitation.status !== 'pending') {
      return NextResponse.json({ msg: 'Invitation already used or expired',success:false  }, { status: 400 });
    }
    if (invitation.expiresAt < new Date().toISOString()) {
      return NextResponse.json({ msg: 'Invitation has expired',success:false  }, { status: 400 });
    }
    if (invitation.invited_user_email !== userEmail) {
      return NextResponse.json({ msg: 'This invitation was not sent to you',success:false  }, { status: 403 });
    }

    await setDoc(doc(teammemberCollection), {
      role: invitation.role,
      team_id: invitation.team_id,
      user_id: userId,
      joinedAt: new Date()
    })
    await setDoc(invitationDoc.ref, { ...invitation, status: 'accepted' }, { merge: true })

    return NextResponse.json({ msg: 'Joined team successfully',success:true }, { status: 200 });


  } catch (error: any) {
    return NextResponse.json({ msg: error.message }, { status: 500 })
  }
}