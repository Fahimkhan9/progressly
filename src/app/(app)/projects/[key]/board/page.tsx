import BoardColumn from '@/components/BoardColumn'
import Sidebar from '@/components/Sidebar'
import React from 'react'

function Page() {
    return (
        <div className="flex p-5">
            <div className="w-40 flex-none ...">
                <Sidebar />
            </div>
            <BoardColumn title="To Do" />
            <BoardColumn title="In Progress" />
            <BoardColumn title="Ready" />

           

        </div>
    )
}

export default Page