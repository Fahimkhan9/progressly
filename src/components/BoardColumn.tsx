import React from 'react'
import BoardCard from './BoardCard'
interface Props{
    title: String
}
function BoardColumn({title}:Props) {
  return (
    <div className="w-20 flex-1 mx-2">
                <div className="flex flex-col items-center justify-center bg-sky-50">
                    {title}
                    <BoardCard
                    type='TODO'
                    />
                </div>
            </div>
  )
}

export default BoardColumn