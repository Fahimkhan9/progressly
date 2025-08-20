'use client'
import { Task } from '@/app/(app)/projects/[key]/board/page'
import { useDraggable } from '@dnd-kit/core'
import React from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { RxDragHandleDots2 } from 'react-icons/rx'
import TaskDetailsModal from './TaskDetailsModal'

type TaskCardProps = {
  task: Task
  isUpdating?: boolean
  dragOverlay?: boolean
  handleButtonPointerDown?: (e: React.PointerEvent) => void
  showtaskdetails?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void
  currentTask?: Task | null
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>
}

function BoardCard({
  task,
  isUpdating = false,
  dragOverlay = false,
  handleButtonPointerDown,
  showtaskdetails,
  currentTask,
  setTasks,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 border border-gray-200 relative flex gap-2"
    >
      {/* Drag handle */}
      <div className="drag-handle cursor-grab text-gray-400 hover:text-gray-600 mt-1" {...listeners} {...attributes}>
        <RxDragHandleDots2 size={18} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
          <button onPointerDown={handleButtonPointerDown} onClick={(e) => showtaskdetails && showtaskdetails(e, task.id)} className="text-gray-500 hover:text-gray-700">
            <CiMenuKebab />
          </button>
        </div>
        {task.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{task.description}</p>}

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{task.status}</span>
          {task.dueDate && <span className="text-xs text-gray-400">
            {new Date(task.dueDate.seconds * 1000 + task.dueDate.nanoseconds / 1000000).toLocaleDateString()}
            </span>}
        </div>

        <div className="flex justify-between items-center mt-1 gap-2 flex-wrap">
          {task.labels?.map((label: string) => (
            <span key={label} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">{label}</span>
          ))}
          <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-200 text-red-700' : task.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' : 'bg-green-200 text-green-700'}`}>
            {task.priority}
          </span>
        </div>

        <TaskDetailsModal currentTask={currentTask} setTasks={setTasks!} />

        {/* Updating overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/60 rounded-xl flex items-center justify-center z-40">
            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  )
}

export default BoardCard
