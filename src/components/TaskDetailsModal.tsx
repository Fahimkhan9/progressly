'use client'
import { Task } from '@/app/(app)/projects/[key]/board/page'
import axios from 'axios'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

function TaskDetailsModal({currentTask,setTasks}:any) {
  const [isDeletingTask, setIsDeletingTask] =useState(false)
  const handleButtonPointerDown = (e: React.PointerEvent) => {
        e.stopPropagation(); // Stop DnD from treating it as drag
      };
  const handletaskdelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      setIsDeletingTask(true)
      const data={
        id:currentTask.id,

      }
      console.log(data);
      
      await axios.post('/api/projects/tasks/delete',data)
      setTasks((prevTasks: Task[]) => prevTasks.filter((task: Task) => task.id !== currentTask.id));
    } catch (error) {
      console.log(error);
      
    }finally{
      setIsDeletingTask(false)
      const modal = document.getElementById('task_details_modal') as HTMLDialogElement;   
      if( modal){
        modal.close()
      }
    }
  }
  return (
    <dialog id="task_details_modal" className="modal">
  <div className="modal-box">
    <div className="flex flex-col justify-center">
      <div className="flex justify-between items-center">
    <h3 className="font-bold text-lg">{currentTask?.title}</h3>
    <div className="tooltip" data-tip='Delete Task'>
    <button disabled={isDeletingTask}
    onClick={handletaskdelete} onPointerDown={handleButtonPointerDown} className="btn bg-red-500"><FaTrash/></button>
    </div>
    </div>
    <p className="py-4">{currentTask?.description}</p>
    <p className="py-4">Assigend To :
    <div className="avatar">
  <div className="w-16 rounded-full">
    <img src={currentTask?.assggnedToImage} alt='image of task assignee' />
  </div>
</div>
    </p>

<p className="py-4">Assigned Email:{currentTask?.assignedToEmail}</p>
    </div>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
  )
}

export default TaskDetailsModal