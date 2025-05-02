import { Task } from '@/app/(app)/projects/[key]/board/page';
import { useDraggable } from '@dnd-kit/core';
import React from 'react'
import { CiMenuKebab } from 'react-icons/ci';


type TaskCardProps = {
  task: Task;
};

function BoardCard({task}:TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;
  return (
    <div  ref={setNodeRef}
    {...listeners}
    {...attributes} style={style} className="card bg-base-100 w-auto m-5 shadow-sm">
  <div className="card-body">
   <div className="flex justify-between">
   <h2 className="card-title">
        {task.title}
        </h2>
        <button className='btn'><CiMenuKebab/></button>
   </div>
    <p>{task.description}</p>
   <p>Assignedto 

   
   </p>
  </div>
</div>
  )
}

export default BoardCard