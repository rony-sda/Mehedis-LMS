import { singleCourse } from '@/app/data/admin/get-admin-course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditCourseForm } from './_components/edit-course-form'
import CourseStructure from './_components/course-structure'

type Params = Promise<{courseId: string}>

export default async function EditPage({params}: {params: Params}) {
  const {courseId} = await params
  const data = await singleCourse(courseId)
  console.log(data)

  return (
    <div>
      <h2 className='text-3xl font-bold mb-8'>Edit Page: 
      <span className='text-primary underline'>{data.title}</span>
    </h2>
      
      <Tabs defaultValue='basic-info' className='w-full'>
        <TabsList className='grid grid-cols-2 w-full'>
          <TabsTrigger value='basic-info'>
            Basic Info
          </TabsTrigger>
          <TabsTrigger value='course-structure'>
            Course Structure
          </TabsTrigger>
        </TabsList>

        <TabsContent value='basic-info'>
          <Card>
            <CardHeader>
              <CardTitle>
                Basic Info
              </CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EditCourseForm sigleData={data}/>
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value='course-structure'>
          <Card>
            <CardHeader>
              <CardTitle>
                Course Structure
              </CardTitle>
              <CardDescription>
                Here You Can Update Your Code Stucture
              </CardDescription>
            </CardHeader>

            <CardContent>
             <CourseStructure sigleData={data}/>
            </CardContent>
          </Card>
        </TabsContent>
    </Tabs>
    </div>
  )
}



