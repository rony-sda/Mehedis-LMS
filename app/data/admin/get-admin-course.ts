import 'server-only'
import { requireAdmin } from './require-admin'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'


export async function singleCourse(id: string) {
await requireAdmin()

  const data = await prisma.course.findUnique({
    where: {
    id: id
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      slug: true,
      status: true,
      category: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true
            }
          }
        }
      }
    }
})


 if(!data) {
      return notFound()
    }
  
  return data
}

export type getEditType = Awaited <ReturnType <typeof singleCourse>>