'use client';
import React, { useState } from 'react'
import BoardCard from './BoardCard'
import { useDroppable } from '@dnd-kit/core';
import { CiDatabase } from 'react-icons/ci';
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
};

function BoardColumn({ column, tasks,members,projectId,isUpdatingTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    disabled:isUpdatingTask
  });
  const [columnId,setColumnId]=useState('')
  const handleAddTask = (columnId: string) => {
    setColumnId(()=> columnId)
    console.log(columnId);
    
   document.getElementById('my_modal_3').showModal();
    
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
            return <BoardCard key={task.id} task={task} />;
          })}
        </div>
      </div>
    </div>
    <TaskModal
    columnId={columnId}
    members={members}
    projectId={projectId}
    />
 </>
  )
}

export default BoardColumn