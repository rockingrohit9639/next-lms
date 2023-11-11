import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { CircleDollarSignIcon, FileIcon, LayoutDashboardIcon, ListChecksIcon } from 'lucide-react'
import { db } from '@/lib/db'
import IconBadge from '@/components/icon-badge'
import TitleForm from './_components/title-form'
import DescriptionForm from './_components/description-form'
import ImageForm from './_components/image-form'
import CategoryForm from './_components/category-form'
import PriceForm from './_components/price-form'
import AttachmentForm from './_components/attachment-form'

export type CourseDetailsProps = {
  params: { courseId: string }
}

export default async function CourseDetails({ params }: CourseDetailsProps) {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId, createdById: userId },
    include: { attachements: { orderBy: { createdAt: 'desc' } } },
  })
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } })

  if (!course) {
    return redirect('/')
  }

  const requiredFields = [course.title, course.description, course.imageUrl, course.price, course.categoryId]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Course Setup</h1>
          <span className="text-sm text-muted-foreground">Completed all fields {completionText}</span>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboardIcon} />
            <h2 className="text-xl">Customize your course</h2>
          </div>

          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecksIcon} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <div>TODO: Chapters</div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSignIcon} />
              <h2 className="text-xl">Sell your course</h2>
            </div>

            <PriceForm initialData={course} courseId={course.id} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileIcon} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
