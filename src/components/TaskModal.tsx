'use client'
import axios from 'axios'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Slide, toast } from 'react-toastify'
type Inputs = {
    title: string
    description: string
    assignedTo: string
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'
}
function TaskModal({  members, projectId }: { columnId: string, members: any[], projectId: string }) {
    const {
        register,
        handleSubmit,
       
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()
    
    
    const onSubmit: SubmitHandler<Inputs> = async (values) => {
        const data = {
            ...values,
           
            projectId

        }
      
        
        
        await axios.post('/api/projects/tasks/create', data)
       
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


    }
    return (

        <dialog id="task_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex justify-center items-center">

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Add Task</legend>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label htmlFor='title' className="label">Name</label>
                            <input id='title' type="text" {...register("title", { required: true })} className="input" placeholder="Name" />
                            {errors.title && <span className='text-red' >{errors.title.message}</span>}
                            <label htmlFor='description' className="label">Description</label>
                            <textarea id='description'  {...register("description", { required: true })} className="input" placeholder="Description" />
                            {errors.description && <span className='text-red' >{errors.description.message}</span>}
                            <label htmlFor="status" className="label">Select Status</label>
                            <select {...register("status", { required: true })}  id="status" defaultValue='TODO' className="select select-primary">
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>
                            {errors.status && <span className='text-red' >{errors.status.message}</span>}
                            <label htmlFor='assignedTo' className="label">Assigned To</label>
                            <select id='assignedTo' {...register("assignedTo", { required: true })} className="select select-primary">

                                {
                                    members.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
                                }
                            </select>
                            {errors.assignedTo && <span className='text-red' >{errors.assignedTo.message}</span>}
                            <button disabled={isSubmitting} type='submit' className="btn btn-neutral mt-4">Add Task</button>
                        </form>
                    </fieldset>

                </div>
            </div>
        </dialog>
    )
}

export default TaskModal