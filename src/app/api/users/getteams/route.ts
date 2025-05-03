import {  teamCollection, teammemberCollection } from "@/lib/firebase";
import {  getAuth } from "@clerk/nextjs/server";
import { getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const { userId } = await getAuth(req)
        if (!userId) {
            return NextResponse.json({ msg: "UNAUTOHORIZED" }, { status: 401 })
        }
        const oq = query(teamCollection, where('creator_id', '==', userId))
        const ownedteamsnap = await getDocs(oq)
        const ownedTeams = ownedteamsnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            role: 'admin',
        }));
        const mq = query(teammemberCollection, where('user_id', '==', userId))
        const memberSnap = await getDocs(mq)
        const teamIds = memberSnap.docs.map(doc => doc.data().team_id);
        let memberTeams: any[] = [];

       
        if (teamIds.length > 0) {
            const teamIdChunks: string[][] = [];
            for (let i = 0; i < teamIds.length; i += 10) {
                teamIdChunks.push(teamIds.slice(i, i + 10));
            }
            const teamFetches = teamIdChunks.map(async chunk => {
                const q = query(teamCollection, where('__name__', 'in', chunk))
                return await getDocs(q)
            }
                // teamCollection.where('__name__', 'in', chunk).get()
            );

            const teamSnapshots = await Promise.all(teamFetches);

            memberTeams = teamSnapshots.flatMap(snapshot =>
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    role: 'member',
                }))
            );

        }
        const teamsMap = new Map<string, any>();

        // Add member teams first
        for (const team of memberTeams) {
            teamsMap.set(team.id, team);
        }

        // Then overwrite with owner teams (higher priority)
        for (const team of ownedTeams) {
            teamsMap.set(team.id, team); // replaces member entry if duplicate
        }

        const allTeams = Array.from(teamsMap.values());
      
        const noownedteam=ownedTeams.length === 0
        
        
        
        return NextResponse.json({ owned: ownedTeams, member: memberTeams, teams: allTeams,noownedteam })
    } catch (error: any) {
        return NextResponse.json({ msg: error.message }, { status: 500 })
    }
}