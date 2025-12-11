import { StudentsPage } from '@/views/students';
import { getStudents } from '@/views/students/api';

const Students = async () => {
  const [initialStudentsData] = await Promise.all([getStudents()]);

  return <StudentsPage initialStudentsData={initialStudentsData} />;
};

export default Students;
