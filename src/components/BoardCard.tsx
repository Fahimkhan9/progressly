import { Task } from '@/app/(app)/projects/[key]/board/page';
import { useDraggable } from '@dnd-kit/core';
import React, { useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci';
import TaskDetailsModal from './TaskDetailsModal';


type TaskCardProps = {
  task: Task;
  handleButtonPointerDown: (e: React.PointerEvent) => void;
  showtaskdetails: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void;
  currentTask: Task | null;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

function BoardCard({ task,handleButtonPointerDown,showtaskdetails,currentTask,setTasks }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  

  const style = transform
    ? {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
    }
    : undefined;
    
  return (
    <>
      <div ref={setNodeRef}
        {...listeners}
        {...attributes} style={style} className="card bg-base-100 w-auto m-5 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">
              {task.title}
            </h2>
           
          </div>
          <p>{task.description}</p>
          <div className="card-actions justify-end">
          <button onPointerDown={handleButtonPointerDown} onClick={(e)=>showtaskdetails(e,task.id)} className='btn '><CiMenuKebab /></button>
    </div>
        </div>
        <TaskDetailsModal currentTask={currentTask} setTasks={setTasks}/>
      </div>
      
    </>
  )
}

export default BoardCard