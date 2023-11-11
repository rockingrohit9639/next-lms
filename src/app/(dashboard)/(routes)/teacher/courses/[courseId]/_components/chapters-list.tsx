'use client'

import { Chapter } from '@prisma/client'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { GripIcon, PencilIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type ChaptersListProps = {
  items: Chapter[]
  onReorder: (updateData: { id: string; position: number }[]) => void
  onEdit: (id: string) => void
}

export default function ChaptersList({ items, onReorder, onEdit }: ChaptersListProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [chapters, setChapters] = useState(items)

  useEffect(function updateMountStatus() {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setChapters(items)
  }, [items])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(chapters)
    const [reorderedItems] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItems)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)

    setChapters(items)

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }))

    onReorder(bulkUpdateData)
  }

  if (!isMounted) {
    return null
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 pr-2 text-sm text-slate-700',
                      { 'border-sky-200 bg-sky-100 text-sky-700': chapter.isPublished },
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn('rounded-l-md border-r border-slate-200 px-2 py-3 transition hover:bg-slate-300', {
                        'border-r-sky-200 hover:bg-sky-200': chapter.isPublished,
                      })}
                      {...provided.dragHandleProps}
                    >
                      <GripIcon className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chapter.isFree ? <Badge>Free</Badge> : null}
                    </div>
                    <Badge className={cn('bg-slate-500', { 'bg-primary': chapter.isPublished })}>
                      {chapter.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <PencilIcon
                      className="h-4 w-4 cursor-pointer transition hover:opacity-75"
                      onClick={() => {
                        onEdit(chapter.id)
                      }}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
