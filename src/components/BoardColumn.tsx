'use client'
import React, { useState } from 'react'
import BoardCard from './BoardCard'
import { useDroppable } from '@dnd-kit/core'
import { IoIosAddCircle } from 'react-icons/io'
import TaskModal from './TaskModal'
import { Task } from '@/app/(app)/projects/[key]/board/page'

type Column = {
  id: string
  title: string
}

type ColumnProps = {
  column: Column
  tasks: Task[]
  members: any[]
  projectId: string
  updatingTaskId: string | null
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

function BoardColumn({ column, tasks, members, projectId, updatingTaskId, setTasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  const [columnId, setColumnId] = useState('')
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  const handleAddTask = (columnId: string) => {
    setColumnId(columnId)
    const modal = document.getElementById('task_modal') as HTMLDialogElement
    if (modal) modal.showModal()
  }

  const handleButtonPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  const showtaskdetails = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    const res = tasks.find((task) => task.id === id)
    setCurrentTask(res || null)
    const modal = document.getElementById('task_details_modal') as HTMLDialogElement
    if (modal) modal.showModal()
  }

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex-1 min-w-[300px] bg-white rounded-2xl shadow-md flex flex-col"
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center px-4 py-2 rounded-t-2xl text-white font-semibold
            ${column.id === "TODO" ? "bg-red-500" : column.id === "IN_PROGRESS" ? "bg-yellow-500" : "bg-green-600"}
          `}
        >
          <span>{column.title}</span>
          <button
            className="hover:scale-110 transition-transform"
            onClick={() => handleAddTask(column.id)}
          >
            <IoIosAddCircle size={28} />
          </button>
        </div>

        {/* Tasks */}
        <div className="flex-1 p-3 space-y-4 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center italic">No tasks</p>
          ) : (
            tasks.map((task) => (
              <BoardCard
                key={task.id}
                task={task}
                isUpdating={updatingTaskId === task.id}
                handleButtonPointerDown={handleButtonPointerDown}
                showtaskdetails={showtaskdetails}
                currentTask={currentTask}
                setTasks={setTasks}
              />
            ))
          )}
        </div>
      </div>

      <TaskModal columnId={columnId} members={members} projectId={projectId} setTasks={setTasks} />
    </>
  )
}

export default BoardColumn
