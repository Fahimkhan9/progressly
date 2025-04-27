import { Link } from 'lucide-react'
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
                        <li><a>Create a Team
                            </a></li>
                        <li><a>Update Profile</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfileSidebar