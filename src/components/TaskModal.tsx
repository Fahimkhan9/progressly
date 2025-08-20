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
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  labels: string
}

function TaskModal({
  members,
  projectId,
  setTasks,
}: {
  columnId?: string
  members: any[]
  projectId: string
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onBlur',
  })

  const addTask: SubmitHandler<Inputs> = async (values) => {
    // trim all string values
    const title = values.title?.trim()
    const description = values.description?.trim()
    const assignedTo = values.assignedTo?.trim()
    const status = values.status
    const priority = values.priority
    const dueDate = values.dueDate
    const labels = values.labels ? values.labels.split(',').map((l) => l.trim()) : []

    // Final validation before submission
    if (!title || !description || !assignedTo || !status || !priority || !dueDate) {
      toast.error('Please fill all required fields!', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
        transition: Slide,
      })
      return
    }

    try {
      const data = { title, description, assignedTo, status, priority, dueDate, labels, projectId }
      const res = await axios.post('/api/projects/tasks/create', data)

      setTasks((prev) => [...prev, res.data.task])
      toast.success('Task created successfully!', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        transition: Slide,
      })

      const taskmodal = document.getElementById('task_modal') as HTMLDialogElement
      if (taskmodal) taskmodal.close()
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || 'Failed to create task', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
        transition: Slide,
      })
    }
  }

  return (
    <dialog id="task_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex justify-center items-center">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Add Task</legend>
            <form onSubmit={handleSubmit(addTask)}>
              <label className="label">Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input"
                placeholder="Task title"
              />
              {errors.title && <span className="text-red-500">{errors.title.message}</span>}

              <label className="label">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className="input"
                placeholder="Description"
              />
              {errors.description && <span className="text-red-500">{errors.description.message}</span>}

              <label className="label">Status</label>
              <select {...register('status', { required: 'Status is required' })} className="select select-primary">
                <option value="">Select Status</option>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
              {errors.status && <span className="text-red-500">{errors.status.message}</span>}

              <label className="label">Assigned To</label>
              <select {...register('assignedTo', { required: 'Assigned To is required' })} className="select select-primary">
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && <span className="text-red-500">{errors.assignedTo.message}</span>}

              <label className="label">Priority</label>
              <select {...register('priority', { required: 'Priority is required' })} className="select select-primary" defaultValue="">
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && <span className="text-red-500">{errors.priority.message}</span>}

              <label className="label">Due Date</label>
              <input
  type="date"
  {...register('dueDate', { required: 'Due Date is required' })}
  className="input"
  min={new Date().toISOString().split('T')[0]}
/>
              {errors.dueDate && <span className="text-red-500">{errors.dueDate.message}</span>}

              <label className="label">Labels (comma separated)</label>
              <input type="text" {...register('labels', { required: 'Labels are required' })} className="input" placeholder="e.g. frontend, bug" />
              {errors.labels && <span className="text-red-500">{errors.labels.message}</span>}

              <button disabled={isSubmitting} type="submit" className="btn btn-neutral mt-4 w-full">
                Add Task
              </button>
            </form>
          </fieldset>
        </div>
      </div>
    </dialog>
  )
}

export default TaskModal
