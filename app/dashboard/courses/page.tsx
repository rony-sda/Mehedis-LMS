import { getAdminCourse } from '@/app/data/admin/get-admin-courses';
import CourseCard from './_components/CourseCard';


const CoursePage = async() => {
  const courses = await getAdminCourse()

  return (
    <div>
       <h2 className='text-3xl font-bold mb-6'>Your Courses</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7'>
        {courses.map((item, idx) => (
          <CourseCard key={idx} data={item} />
        ))}
      </div>
    </div>
   
  );
};

export default CoursePage;