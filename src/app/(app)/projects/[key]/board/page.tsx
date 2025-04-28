'use client'
import BoardColumn from '@/components/BoardColumn'
import Sidebar from '@/components/Sidebar'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Item } from '@radix-ui/react-navigation-menu'
import React, { useState } from 'react'
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type column={
    id: string,
    title: string
}

const columns: column[]=[
    {id:'TODO',title:"To Do"},
    {id:"IN_PROGRESS",title:'In Progress'},
    {id:"DONE",title:'Done'},


]
type Task = {
    id: string;
    status: TaskStatus;
    title: string;
    description: string;
  };
  
const INITIAL_TASKS: Task[] = [
    {
      id: '1',
      title: 'Research Project',
      description: 'Gather requirements and create initial documentation',
      status: 'TODO',
    },
    {
      id: '2',
      title: 'Design System',
      description: 'Create component library and design tokens',
      status: 'TODO',
    },
    {
      id: '3',
      title: 'API Integration',
      description: 'Implement REST API endpoints',
      status: 'IN_PROGRESS',
    },
    {
      id: '4',
      title: 'Testing',
      description: 'Write unit tests for core functionality',
      status: 'DONE',
    },
  ];

function Page() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
    
        if (!over) return;
    
        const taskId = active.id as string;
        const newStatus = over.id as Task['status'];
    
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
      }
      console.log(tasks);
      
    return (
        <div className="flex p-5">
            <div className="w-40 flex-none ...">
                <Sidebar />
            </div>
            <DndContext onDragEnd={handleDragEnd}>
            {
            columns.map(column=><BoardColumn
                 key={column.id}
                 column={column}
                 tasks={tasks.filter((task) => task.status === column.id)}
                 />)
           }
            </DndContext>
          

           

        </div>
    )
}

export default Page