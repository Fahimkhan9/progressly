'use client'
import axios from 'axios'
import React, { useEffect } from 'react'

function Page({params}: { params: { token: string } }) {
  
  useEffect(()=>{
    (async ()=>{
      const {token}=await params
     try {
      if(token){
        const data={token}
        const res=await axios.post('/api/users/invitemember/accept',data)
      
        
      }
     } catch (error) {
      console.log(error);
      
     }
    })()
  },[])
  return (
    <div>Page</div>
  )
}

export default Page