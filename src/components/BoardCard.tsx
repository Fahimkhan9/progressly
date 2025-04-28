import { useDraggable } from '@dnd-kit/core';
import React from 'react'
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type Task = {
  id: string;
  status: TaskStatus;
  title: string;
  description: string;
};
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
    <h2 className="card-title">
        {task.title}
        </h2>
    <p>{task.description}</p>
   
  </div>
</div>
  )
}

export default BoardCard