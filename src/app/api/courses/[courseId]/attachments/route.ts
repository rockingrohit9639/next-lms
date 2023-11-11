import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { url } = await request.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        createdById: userId,
      },
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const attachment = await db.attachement.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: params.courseId,
      },
    })

    return NextResponse.json(attachment)
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
