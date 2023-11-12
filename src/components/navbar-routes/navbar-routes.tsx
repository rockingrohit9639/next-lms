'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import SearchInput from '../search-input'
import { isTeacher } from '@/lib/teacher'

export default function NavbarRoutes() {
  const { userId } = useAuth()

  const pathname = usePathname()
  const isTeacherPage = pathname?.startsWith('/teacher')
  const isPlayerPage = pathname?.includes('/courses')
  const isSearchPage = pathname === '/search'

  return (
    <>
      {isSearchPage ? (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      ) : null}
      <div className="ml-auto flex gap-x-2">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="mr-2 h-4 w-5" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        ) : null}

        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  )
}
