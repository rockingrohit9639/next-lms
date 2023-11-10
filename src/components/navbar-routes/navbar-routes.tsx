'use client'

import { UserButton } from '@clerk/nextjs'

export default function NavbarRoutes() {
  return (
    <div className="ml-auto flex gap-x-2">
      <UserButton />
    </div>
  )
}
