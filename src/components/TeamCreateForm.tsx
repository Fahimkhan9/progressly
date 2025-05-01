
'use client'
import { teamCollection } from '@/lib/firebase'
import { useUser } from '@clerk/nextjs'
import { addDoc, doc, setDoc } from 'firebase/firestore'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { Slide, toast, ToastContainer } from 'react-toastify'
type Inputs = {
  name: string
  description: string
}
function TeamCreateForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors,isSubmitting },
  } = useForm<Inputs>()
  const {user}=useUser()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const docref=await setDoc(doc(teamCollection),{
        name:data.name,
        description:data.name,
        creator_id:user?.id
      })
       toast.success('Team created successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
                });
      
      
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  <legend className="fieldset-legend">Create a Team</legend>

  <form onSubmit={handleSubmit(onSubmit)}>
  <label htmlFor='name' className="label">Name</label>
  <input id='name' {...register("name", { required: true })} type="text" className="input" placeholder="Name" />
 {errors.name && <span className='text-red' >{errors.name.message}</span>}
  <label htmlFor='description' className="label">Description</label>
  <textarea id='description' {...register("description", { required: true })} className="input" placeholder="Description" />
  {errors.description && <span className='text-red' >{errors.description.message}</span>}
  <button disabled={isSubmitting} type='submit' className="btn btn-secondary mt-4">Create Team</button>
  </form>
  <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Slide}
/>
</fieldset>
  )
}

export default TeamCreateForm