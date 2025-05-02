'use client'
import BoardColumn from '@/components/BoardColumn'
import FullPageLoader from '@/components/FullPageLoader'
import Sidebar from '@/components/Sidebar'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'

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


function Page({ params }: { params: { key: string } }) {
  const { key } = params;
  console.log(key);
  const [members, setMembers] = useState([])
  const [ismemberLoading, setIsMemberLoading] = useState(false)
  const [isUpdatingTask,setIsUpdatingTask]=useState(false)
  const [tasks, setTasks] = useState<Task[]>([]);
async  function handleDragEnd(event: DragEndEvent) {
    try {
      const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];
    console.log(taskId);
    console.log(newStatus);
    const data={
      status: newStatus,
      order: Date.now(),
    }
    setIsUpdatingTask(true)
    const res=await axios.patch(`/api/projects/tasks/${taskId}`, data)
    console.log(res.data);
    
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
  const loadteammembers = async (team_id: string) => {
    try {
      setIsMemberLoading(true)
      console.log(team_id);

      if (team_id) {
        const data = { team_id }
        const res = await axios.post('/api/users/getmembers', data)

        console.log(res.data.response);

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

      const res = await axios.get(`/api/projects/tasks/${projectId}`)
      console.log(res.data.tasks);
      setTasks(res.data.tasks)

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    loadteammembers(key)
    loadtasks(key)

  }, [])

  return (
    <div className="flex p-5">
      <div className="w-40 flex-none ...">
        <Sidebar id={key} />
            {isUpdatingTask && <FullPageLoader/>}
      </div>
  {/* <div> */}

  <DndContext  onDragEnd={handleDragEnd}>
        {
          columns.map(column => <BoardColumn
            key={column.id}
            column={column}
            projectId={key}
            members={members}
            isUpdatingTask={isUpdatingTask}
            tasks={tasks.filter((task) => task.status === column.id)}
          />)
        }
       
      </DndContext>
  {/* </div> */}




    </div>
  )
}

export default Page