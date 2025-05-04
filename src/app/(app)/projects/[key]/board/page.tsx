'use client'
import BoardColumn from '@/components/BoardColumn'
import FullPageLoader from '@/components/FullPageLoader'
import Sidebar from '@/components/Sidebar'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import axios from 'axios'
import React, {  use, useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import { Slide, toast } from 'react-toastify'

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type column = {
  id: string,
  title: string
}

const columns: column[] = [
  { id: 'TODO', title: "To Do" },
  { id: "IN_PROGRESS", title: 'In Progress' },
  { id: "DONE", title: 'Done' },


]
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: string | null;
  createdBy: string;
  createdAt: string;
  order: number;
}


function Page({ params }:any ) {
  const { key } = use(params);

  const [members, setMembers] = useState([])
  const [ismemberLoading, setIsMemberLoading] = useState(false)
  const [isUpdatingTask,setIsUpdatingTask]=useState(false)
  const [isLoadingTask,setIsLoadingTask] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([]);
async  function handleDragEnd(event: DragEndEvent) {
    try {
      const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    const data={
      status: newStatus,
      order: Date.now(),
    }
    setIsUpdatingTask(true)
    await axios.patch(`/api/projects/tasks/${taskId}`, data)
   
    
    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId
          ? {
            ...task,
            status: newStatus,
          }
          : task,
      ),
    );
    setIsUpdatingTask(false)
    } catch (error) {
      console.log(error);
      
    }finally{
      setIsUpdatingTask(false)

    }
  }
  const loadteammembers = async (projectId: string) => {
    try {
      setIsMemberLoading(true)
    

      if (projectId) {
        const data = { projectId }
        const res = await axios.post('/api/users/getmembers', data)

       
        console.log(res.data);
        
        setMembers(res.data.response)
        setIsMemberLoading(false)
      }
    } catch (error) {
      console.log(error);
      setIsMemberLoading(false)
    } finally {
      setIsMemberLoading(false)
    }
  }
  const loadtasks = async (projectId: string) => {
    try {
      setIsLoadingTask(true)
      const res = await axios.get(`/api/projects/tasks/${projectId}`)
    
      setTasks(res.data.tasks)

    } catch (error) {
      console.log(error);
      // show toast eerror on top-right
      
      toast.error('Failed to load tasks!', {
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
    }finally{
      setIsLoadingTask(false)

    }
  }
  
  useEffect(() => {
    loadteammembers(key)
   

  }, [])
useEffect(()=>{
  loadtasks(key)
},[setTasks])
  return (
    <div className="flex p-5 min-h-screen">
      <div className="w-40 flex-none ...">
        <Sidebar id={key} />
            {(isUpdatingTask || isLoadingTask )&& <FullPageLoader/>}
      </div>
  {/* <div> */}

  <DndContext  onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        {
          columns.map(column => <BoardColumn
            key={column.id}
            column={column}
            projectId={key}
            members={members}
            isUpdatingTask={isUpdatingTask}
            tasks={tasks.filter((task) => task.status === column.id)}
            setTasks={setTasks}
          />)
        }
       
      </DndContext>
  {/* </div> */}




    </div>
  )
}

export default Page