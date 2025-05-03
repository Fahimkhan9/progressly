
import axios from 'axios'
import Link from 'next/link'

import { useRouter } from 'next/navigation'
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
function ProjectCreateForm({teams,noownedteam}: { teams: team[],noownedteam:boolean }) {
  

  const {
      register,
      handleSubmit,
      
      formState: { errors,isSubmitting },
    } = useForm<Inputs>()
    const router=useRouter()
    const onSubmit:SubmitHandler<Inputs>=async (values)=>{
      try {
        const data={
          name:values.name,
          description:values.description,
          teamId:values.team_id,
      
        }
        await axios.post('/api/projects/create',data)
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
          router.push('/projects')
      } catch (error) {
        console.log(error);
        
      }

    }
    
  
    
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  <legend className="fieldset-legend">Create Project</legend>
<form onSubmit={handleSubmit(onSubmit)}>
<label htmlFor='name' className="label">Name</label>
  <input id='name' {...register("name", { required: true })}  type="text" className="input" placeholder="Enter project name" />
  <span className="text-red">{
    errors.name && errors.name.message
    }</span>
  <label htmlFor='description' className="label">Description</label>
  <textarea maxLength={50}  id='description'  {...register("description", { required: true })} className="input" placeholder="Enter project description" />
  <span className="text-red">{
    errors.description && errors.description.message
    }</span>
    <label htmlFor='team_id' className="label">Team for project</label>
    {
      teams.length>0 && <select {...register("team_id", { required: true })}  className="select">
      
      {
        teams.map(i=><option key={i.id} value={i.id} >{i.name}</option>)
      }
    </select>
    }
     <span className="text-red">{
    errors.team_id && errors.team_id.message
    }</span>
  <br />
  <button disabled={isSubmitting || noownedteam} type='submit' className="btn text-white bg-[#3D365C] mt-4">Create Project</button>
</form>

{noownedteam && <span className='bg-red-600 rounded-lg text-center p-2 text-white text-xl'>You don't have any teams yet!Please create a team.
  <span className="link">
    <Link href='/profile/team/create'>Click here to create team</Link>
  </span>
  </span>}
</fieldset>
  )
}

export default ProjectCreateForm