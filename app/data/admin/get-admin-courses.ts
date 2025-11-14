

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";


export async function getAdminCourse() {
 await requireAdmin()

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true
    }
  })

  return data
}


export type getAdminCourseType = Awaited <ReturnType <typeof getAdminCourse>>[0]