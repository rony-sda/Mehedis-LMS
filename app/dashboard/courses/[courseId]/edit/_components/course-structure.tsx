'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { ReactNode, useState } from 'react';
import {CSS} from '@dnd-kit/utilities';
import { getEditType } from '@/app/data/admin/get-admin-course';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, FileText, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface iAppProps {
  sigleData: getEditType,
}

interface SortableItemProps {
  id: string,
  children: (listeners: DraggableSyntheticListeners) => ReactNode
  className?: string,
  data?: {
    type: 'chapter' | 'lesson',
    chapterId?: string,

  }
}

export default function CourseStructure({ sigleData }: iAppProps) {
  
  const initialltems = sigleData.chapter.map((ct) => ({
    id: ct.id,
    title: ct.title,
    order: ct.position,
    isOpen: true,
    lessons: ct.lessons.map((ls) => ({
      id: ls.id,
      title: ls.title,
      order: ls.position
    }))
  }));

  const [items, setItems] = useState(initialltems);

  function SortableItem({id, data, className, children}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: id, data: data});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cn(
      'touch-none', className, isDragging ? "z-10" : ""
    )}>
     {children(listeners)}
    </div>
  );
}
  
   function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function toggleChapter(chapterId: string) {
    setItems(items.map((ct) => ct.id === chapterId ? {...ct , isOpen: !ct.isOpen} : ct)
  )}

   const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border'>
        <CardTitle>
          Chapter
          </CardTitle>
          </CardHeader>
        <CardContent>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} data={{type: 'chapter'}}>
                {(listeners) => (
                  <Card>
                    <Collapsible open={item.isOpen} onOpenChange={()=> toggleChapter(item.id)}>
                      <div className='flex items-center justify-between p-3 border-b border-border'>
                        <div className='flex items-center'>
                          <Button
                          variant="ghost" size='icon'   {...listeners}>
                            <GripVertical className='size-4'/>
                          </Button>

                          <CollapsibleTrigger asChild
                          >
                            <Button variant="ghost" size='icon'>
                              {item.isOpen ? <ChevronDown className='size-4'/> : <ChevronRight className='size-4'/>}
                            </Button>
                          </CollapsibleTrigger>
                          <p className='cursor-pointer hover:text-primary'>{item.title}</p>
                        </div>

                        <Button variant='outline'>
                          <Trash2 className='size-4'/>
                        </Button>
                      </div>
                      
                      <CollapsibleContent>
                        <div className='p-1'>
                          
                          <SortableContext items={item.lessons.map((ls) => ls.id)} strategy={verticalListSortingStrategy}>
                            {item.lessons.map((lesson) => (
                              <SortableItem key={lesson.id} id={lesson.id} data={{type: 'lesson' , chapterId: item.id}}>
                                {(lessonListeners) => (
                                  <div className='flex items-center justify-between p-2 hover:bg-accent rounded-sm'>
                                    <div className='flex items-center gap-2'>
                          <Button
                          variant="ghost" size='icon'   {...lessonListeners}>
                            <GripVertical className='size-4'/>
                          </Button>

                          <FileText className='size-4'/>
                                      <Link href={`/dashboard/courses/${sigleData.id}/${item.id}/${lesson.id}`}>{lesson.title}</Link>
                                    </div>
                                    <Button variant='outline'>
                          <Trash2 className='size-4'/>
                        </Button>
                                  </div>
                             )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className='p-2'>
                            <Button className='w-full' variant='outline'>
                              Create New Lessons
                             </Button>
                          </div>
                      </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
              )}
              </SortableItem>
            ))}
          </SortableContext>
          </CardContent>
      </Card>
  </DndContext>
  )
}
