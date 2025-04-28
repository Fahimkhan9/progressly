'use client';
import React from 'react'
import BoardCard from './BoardCard'
import { useDroppable } from '@dnd-kit/core';
type column={
  id: string,
  title: string
}
type Task = {
  id: string;
  status: TaskStatus;
  title: string;
  description: string;
};
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type ColumnProps = {
  column: column;
  tasks: Task[];
};

function BoardColumn({column,tasks}:ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  return (
    <div ref={setNodeRef} className="w-20 flex-1 mx-2">
                <div className="flex flex-col items-center justify-center bg-sky-50">
                    {column.title}
                    <div  className="">
                    {tasks.map((task) => {
          return <BoardCard key={task.id} task={task} />;
        })}
                    </div>
                </div>
            </div>
  )
}

export default BoardColumn