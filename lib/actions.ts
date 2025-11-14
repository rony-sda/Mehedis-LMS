"use server"
import { CourseSchema, CourseSchemaType } from '@/lib/schemas';
import prisma from './db';
import { ApiRespone } from './types';
import { requireAdmin } from '@/app/data/admin/require-admin';

export async function createCourse(values: CourseSchemaType): Promise<ApiRespone> {
   const session = await requireAdmin()
  try {
  const validation = CourseSchema.safeParse(values)
  if (!validation.success) {
    return {
      status: 'error',
      message: 'Invalid Form Data'
    }
  }

  await prisma.course.create({
    data: {
      ...validation.data,
      userId: session?.user.id as string
    }
  })

  return {
    status: 'success',
    message: 'Course Created Successfully',
  }
} catch  {
  return {
    status: 'error',
    message: 'Course Created Faild'
  }
}
}


export async function deleteCourse(id: string) : Promise<ApiRespone> {
 try {
  await requireAdmin()
  await prisma.course.delete({
    where: {
     id: id
   }
  })
  
  return {
    status: 'success',
    message: 'Course Deleted Successfully',
  }
 } catch {
   return {
    status: 'error',
    message: 'Course Deleting Faild'
  }
 }
}


export async function editCourse(data: CourseSchemaType,courseId: string): Promise<ApiRespone> {
  const user = await requireAdmin()

  try {
    const result = CourseSchema.safeParse(data)
    if (!result.success) {
      return {
        message: 'invalid data type',
        status: 'error'
      }
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id
      },
      data: {
        ...result.data
      }
    })

    return {
      message: 'course updated successfully',
      status: 'success'
    }
  } catch  {
    return {
      status: 'error',
      message: 'Failed to Update Course'
    }
  }
}

