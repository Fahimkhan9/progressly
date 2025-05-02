import Link from 'next/link'
import React from 'react'

function ProfileSidebar() {
    return (
        <div className="flex">

            <div className="drawer lg:drawer-open">

                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center justify-center">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        Open drawer
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-40 p-4">
                        {/* Sidebar content here */}
                        <li><Link href='/profile/team/create'>Create a Team</Link>
                        </li>
                        <li><Link href='/profile/team/'>Teams</Link>
                        </li>
                        <li><Link href='/projects/create/'>Create a Project</Link>
                        </li>
                        <li><Link href='/projects/'>Project</Link>
                        </li>
                        <li><Link href='/profile'>Profile</Link> </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfileSidebar