'use client'
import { Task } from '@/app/(app)/projects/[key]/board/page'
import axios from 'axios'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

function TaskDetailsModal({ currentTask, setTasks }: any) {
  const [isDeletingTask, setIsDeletingTask] = useState(false)

  const handleButtonPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation() // Stop DnD from treating it as drag
  }

  const handleTaskDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation()
      setIsDeletingTask(true)
      await axios.post('/api/projects/tasks/delete', { id: currentTask.id })
      setTasks((prevTasks: Task[]) => prevTasks.filter((task: Task) => task.id !== currentTask.id))
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeletingTask(false)
      const modal = document.getElementById('task_details_modal') as HTMLDialogElement
      if (modal) modal.close()
    }
  }

  if (!currentTask) return null
  console.log(currentTask)
  return (
    <dialog id="task_details_modal" className="modal">
      <div className="modal-box max-w-lg w-full bg-white rounded-xl shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{currentTask.title}</h2>
          <button
            disabled={isDeletingTask}
            onClick={handleTaskDelete}
            onPointerDown={handleButtonPointerDown}
            className="btn btn-error btn-sm flex items-center gap-2"
            title="Delete Task"
          >
            <FaTrash /> Delete
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4">{currentTask.description}</p>

        {/* Assignee */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Assigned To:</span>
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={currentTask.assignedToImage} alt="Assignee" />
              </div>
            </div>
            <span className="text-gray-600">{currentTask.assignedToEmail}</span>
          </div>
        </div>

        {/* Task Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Status:</span> {currentTask.status}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Priority:</span>{' '}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                currentTask.priority === 'high'
                  ? 'bg-red-200 text-red-700'
                  : currentTask.priority === 'medium'
                  ? 'bg-yellow-200 text-yellow-700'
                  : 'bg-green-200 text-green-700'
              }`}
            >
              {currentTask.priority}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Due Date:</span>{' '}
           {new Date(currentTask.dueDate.seconds * 1000 + currentTask.dueDate.nanoseconds / 1000000).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created At:</span>{' '}
           {new Date(currentTask.createdAt.seconds * 1000 + currentTask.createdAt.nanoseconds / 1000000).toLocaleDateString()}
          </div>
        </div>

        {/* Labels */}
        {currentTask.labels?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentTask.labels.map((label: string) => (
              <span
                key={label}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Activity Log */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Activity</h3>
          <ul className="max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
            {currentTask.activity?.map((act: any, idx: number) => (
              <li key={idx} className="text-sm text-gray-600 border-b last:border-b-0 py-1">
                <span className="font-medium">{act?.user?.email}</span>: {act.action}{' '}
                <span className="text-gray-400 text-xs">
                  ({new Date(act.timestamp.seconds * 1000 + act.timestamp.nanoseconds / 1000000).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Close */}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-neutral w-full">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default TaskDetailsModal
