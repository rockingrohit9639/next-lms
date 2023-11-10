'use client'

import { CompassIcon, LayoutIcon } from 'lucide-react'
import SidebarItem from './sidebar-item'

const guestRoutes = [
  {
    icon: LayoutIcon,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: CompassIcon,
    label: 'Browse',
    href: '/search',
  },
]

export default function SidebarRoutes() {
  const routes = guestRoutes

  return (
    <div className="flex w-full flex-col">
      {routes.map((route) => (
        <SidebarItem key={route.href} {...route} />
      ))}
    </div>
  )
}
