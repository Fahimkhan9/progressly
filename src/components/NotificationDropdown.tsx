'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import {  query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import {  notificationCollection } from '@/lib/firebase';

import { FaTrash } from 'react-icons/fa';
import { Slide, toast } from 'react-toastify';



type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
};

export default function NotificationDropdown({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const q = query(
      notificationCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
     
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const handledelete=async(id:string)=>{
    try {
      setIsDeleting(true);
      const notificationRef=doc(notificationCollection,id)
      await deleteDoc(notificationRef);
       toast.success('Removed Notification', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
                });
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove Notification', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
        });
    }finally{
      setIsDeleting(false);

    }
  }
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle indicator">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="indicator-item badge badge-sm badge-error">{unreadCount}</span>
        )}
      </div>
      <div
        tabIndex={0}
        className="mt-3 z-[99] card card-compact dropdown-content w-80 bg-base-100 shadow-xl border border-base-200"
      >
        <div className="card-body max-h-96 overflow-auto">
          <h3 className="font-bold text-lg">Notifications</h3>
          {notifications.length === 0 ? (
            <span className="text-sm text-gray-400">No notifications yet</span>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="p-2 border-b border-base-200">
              <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">{notif.title}</p>
              <button disabled={isDeleting} onClick={()=>handledelete(notif.id)} className='btn bg-red-500'><FaTrash/></button>
              </div>
                <p className="text-xs text-gray-500">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
