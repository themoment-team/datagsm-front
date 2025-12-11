import { getClubs } from '@/entities/club';
import { StudentsPage } from '@/views/students';
import { getStudents } from '@/views/students/api';

const Students = async () => {
  const [initialStudentsData, initialClubsData] = await Promise.all([getStudents(), getClubs()]);

  return (
    <StudentsPage initialStudentsData={initialStudentsData} initialClubsData={initialClubsData} />
  );
};

export default Students;
