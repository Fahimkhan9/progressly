'use client'

import BoardColumn from '@/components/BoardColumn'
import Sidebar from '@/components/Sidebar'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Slide, toast } from 'react-toastify'

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

type Column = {
  id: string
  title: string
}

const columns: Column[] = [
  { id: 'TODO', title: "To Do" },
  { id: "IN_PROGRESS", title: 'In Progress' },
  { id: "DONE", title: 'Done' },
]

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  assignedTo?: string | null
  createdBy: string
  createdAt: string
  order: number
}

interface TasksPageProps {
  projectKey: string
}

export default function TasksPage({ projectKey }: TasksPageProps) {
  const [members, setMembers] = useState([])
  const [isMemberLoading, setIsMemberLoading] = useState(false)
  const [isLoadingTask, setIsLoadingTask] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'mine'>('all')

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

  async function handleDragEnd(event: DragEndEvent) {
    try {
      const { active, over } = event
      if (!over) return setActiveId(null)

      const taskId = active.id as string
      const newStatus = over.id as Task['status']
      const existing = tasks.find(t => t.id === taskId)
      if (!existing || existing.status === newStatus) return setActiveId(null)

      setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)))
      setActiveId(null)
      setUpdatingTaskId(taskId)

      await axios.patch(`/api/projects/tasks/${taskId}`, { status: newStatus, order: Date.now() })
    } catch (error) {
      console.error(error)
      toast.error('Failed to update task!', { position: "top-right", autoClose: 4000, theme: "colored", transition: Slide })
      loadTasks(projectKey, filter === 'mine')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const loadTeamMembers = async (projectId: string) => {
    try {
      setIsMemberLoading(true)
      const res = await axios.post('/api/users/getmembers', { projectId })
      setMembers(res.data.response)
    } catch (error) {
      console.log(error)
    } finally {
      setIsMemberLoading(false)
    }
  }

  const loadTasks = async (projectId: string, myTasks: boolean = false) => {
    try {
      setIsLoadingTask(true)
      const url = `/api/projects/tasks/${projectId}${myTasks ? '?myTasks=true' : ''}`
      const res = await axios.get(url)
      setTasks(res.data.tasks)
    } catch (error) {
      console.log(error)
      toast.error('Failed to load tasks!', { position: "top-right", autoClose: 5000, theme: "colored", transition: Slide })
    } finally {
      setIsLoadingTask(false)
    }
  }

  useEffect(() => {
    loadTeamMembers(projectKey)
    loadTasks(projectKey, filter === 'mine')
  }, [projectKey, filter])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar id={projectKey} />

      <div className="flex-1 p-5">
        {/* Filter Dropdown */}
        <div className="flex justify-end mb-4 relative">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full font-semibold">
              {filter === 'all' ? 'All Tasks' : 'My Tasks'}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-40 mt-2">
              <li>
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'font-bold text-blue-600' : ''}>
                  All Tasks
                </button>
              </li>
              <li>
                <button onClick={() => setFilter('mine')} className={filter === 'mine' ? 'font-bold text-blue-600' : ''}>
                  My Tasks
                </button>
              </li>
            </ul>
          </div>
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <div className="flex gap-4 overflow-x-auto pb-6">
            {columns.map(column => (
              <div key={column.id} className="flex-1 min-w-[250px]">
                <h2 className="font-bold mb-3 text-gray-800">{column.title}</h2>

                {isLoadingTask ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 mb-3 shadow animate-pulse h-28" />
                  ))
                ) : (
                  <BoardColumn
                    column={column}
                    projectId={projectKey}
                    members={members}
                    updatingTaskId={updatingTaskId}
                    tasks={tasks.filter(task => task.status === column.id)}
                    setTasks={setTasks}
                  />
                )}
              </div>
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 150 }}>
            {activeId && (
              <div className="pointer-events-none z-50 transform scale-105">
                <div className="bg-white p-4 rounded-xl shadow-lg w-64 h-28 animate-pulse" />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
