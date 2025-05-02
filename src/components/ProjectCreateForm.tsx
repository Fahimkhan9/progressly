import { projectCollection } from '@/lib/firebase'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { doc, setDoc } from 'firebase/firestore'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Slide, toast } from 'react-toastify'
type Inputs = {
  name: string
  description: string
  team_id:string
}
type team={
  name:string,
  description:string,
  creator_id:string,
  id:string
}
function ProjectCreateForm({teams}) {
  const {user}=useUser()

  const {
      register,
      handleSubmit,
      watch,
      formState: { errors,isSubmitting },
    } = useForm<Inputs>()
    const onSubmit:SubmitHandler<Inputs>=async (values)=>{
      try {
        const data={
          name:values.name,
          description:values.description,
          teamId:values.team_id,
      
        }
        const res=await axios.post('/api/projects/create',data)
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
    
    console.log(teams);
    
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  <legend className="fieldset-legend">Login</legend>
<form onSubmit={handleSubmit(onSubmit)}>
<label htmlFor='name' className="label">Email</label>
  <input id='name' {...register("name", { required: true })}  type="text" className="input" placeholder="Enter project name" />
  <span className="text-red">{
    errors.name && errors.name.message
    }</span>
  <label htmlFor='description' className="label">Password</label>
  <textarea  id='description'  {...register("description", { required: true })} className="input" placeholder="Enter project description" />
  <span className="text-red">{
    errors.description && errors.description.message
    }</span>
    <label htmlFor='team_id' className="label">Team for project</label>
    {
      teams.length>0 && <select {...register("team_id", { required: true })}  className="select">
      
      {
        teams.map(i=><option value={i.id} >{i.name}</option>)
      }
    </select>
    }
     <span className="text-red">{
    errors.team_id && errors.team_id.message
    }</span>
  <button disabled={isSubmitting} type='submit' className="btn btn-neutral mt-4">Create Project</button>
</form>


</fieldset>
  )
}

export default ProjectCreateForm