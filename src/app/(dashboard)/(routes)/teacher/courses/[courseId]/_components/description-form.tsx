'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Course } from '@prisma/client'
import { PencilIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

type DescriptionFormProps = {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  description: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

export default function DescriptionForm({ initialData, courseId }: DescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData.description ?? '' },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: FormSchema) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success('Course updated!')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4 md:mt-0">
      <div className="flex items-center justify-between font-medium">
        Course Description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Description
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <p className={cn('mt-2 text-sm', { 'italic text-muted-foreground': !initialData.description })}>
          {initialData.description ?? 'No description provided'}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea disabled={isSubmitting} placeholder="e.g. This course is about" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
