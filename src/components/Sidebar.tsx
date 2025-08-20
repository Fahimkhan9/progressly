'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar({ id }: { id: string }) {
  const pathname = usePathname()

  const links = [
    { label: 'Board', href: `/projects/${id}/board` },
    { label: 'Profile', href: `/profile` },
  ]

  return (
    <aside className="bg-white shadow-lg w-52 min-h-screen flex flex-col p-4 sticky top-0">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Project</h1>

      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 hover:bg-blue-600 hover:text-white ${pathname === link.href ? 'bg-blue-500 text-white' : ''}`}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
