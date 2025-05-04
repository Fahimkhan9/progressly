'use client';
import React, { useState } from 'react'
import BoardCard from './BoardCard'
import { useDroppable } from '@dnd-kit/core';

import { IoIosAddCircle } from 'react-icons/io';
import TaskModal from './TaskModal';
import { Task } from '@/app/(app)/projects/[key]/board/page';
type column = {
  id: string,
  title: string
}

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type ColumnProps = {
  column: column;
  tasks: Task[];
  members: any[];
  projectId:string
  isUpdatingTask:boolean
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

function BoardColumn({ column, tasks,members,projectId,isUpdatingTask,setTasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  const [columnId,setColumnId]=useState('')
  const [currentTask,setCurrentTask]=useState<Task | null>(null)
  const handleAddTask = (columnId: string) => {
    setColumnId(()=> columnId)

    
   const modal = document.getElementById('task_modal') as HTMLDialogElement;
   if (modal) {
     modal.showModal();
   }
    
  }
 const handleButtonPointerDown = (e: React.PointerEvent) => {
       e.stopPropagation(); // Stop DnD from treating it as drag
     };
   const showtaskdetails = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,id: string) => {
     e.stopPropagation();

    const res=tasks.find((task) => task.id === id)
    
    setCurrentTask(res || null)
     const modal = document.getElementById('task_details_modal') as HTMLDialogElement;
     if (modal) {
       modal.showModal();
     }
 
   }
  
  return (
 <>
    <div ref={setNodeRef}  className="w-20 flex-1 mx-2">
      <div className="flex flex-col items-center justify-center bg-sky-50">
        <div className="flex flex-row justify-between items-center w-full bg-sky-200 p-2 rounded-t-lg"> 
       <div> {column.title}</div>
       <div className='btn btn-primary' onClick={()=>handleAddTask(column.id)} > <IoIosAddCircle /></div>

        </div>
        <div className="">
          {tasks.map((task) => {
            return <BoardCard key={task.id} task={task} handleButtonPointerDown={handleButtonPointerDown} showtaskdetails={showtaskdetails} currentTask={currentTask} setTasks={setTasks}  />;
          })}
        </div>
      </div>
    </div>
    <TaskModal
    columnId={columnId}
    members={members}
    projectId={projectId}
    setTasks={setTasks}
    />
 </>
  )
}

export default BoardColumn