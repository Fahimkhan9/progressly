import React from 'react'


interface Props{
    type:String
}

function BoardCard({type}:Props) {
  return (
    <div draggable className="card bg-base-100 w-auto m-5 shadow-sm">
  <div className="card-body">
    <h2 className="card-title">
        Card title!
        </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
   
  </div>
</div>
  )
}

export default BoardCard