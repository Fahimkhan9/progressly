import { projectCollection, taskCollection, teamCollection } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json()
        if (!id) {
            return NextResponse.json({ message: 'Invalid id' }, { status: 400 })
        }
        // delete team collection from firebase
        const taskCollectionRef = doc(taskCollection, id);

        await deleteDoc(taskCollectionRef);
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ msg: error.message }, { status: 500 })
    }
}