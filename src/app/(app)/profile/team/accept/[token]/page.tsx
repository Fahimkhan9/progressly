'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Page({params}: { params: { token: string } }) {
  const [isLoading, setIsLoading] =useState(false)
  const [invitationSuccess,setInvitationSuccess]=useState(false)
  const [err,setErr]=useState('')
  useEffect(()=>{
    (async ()=>{
      setIsLoading(true)
      const {token}=await params
     try {
      if(token){
        const data={token}
        const res=await axios.post('/api/users/invitemember/accept',data)
        if(res.data.success){
          setInvitationSuccess(true)
        }
        
      }
     } catch (error) {
      console.log(error);
      
     }finally{
      setIsLoading(false)
     }
    })()
  },[])
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded shadow-md w-96">
        {isLoading ? (
          <p>Loading...</p>
        ) : invitationSuccess ? (
          <h1 className='text-green-500'>Invitation accepted successfully!</h1>
        ) : (
          <h1 className='text-red-500'>Failed to accept the invitation.</h1>
        )}
      </div>
    </div>
  )
}

export default Page