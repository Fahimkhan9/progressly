
'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

function AcceptTeamInvitePage() {
    const router=useRouter()
    console.log(router.query.token);
    
  return (
    <div>AcceptTeamInvitePage</div>
  )
}

export default AcceptTeamInvitePage