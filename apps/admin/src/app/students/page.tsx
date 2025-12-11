import { getClubs } from '@/entities/club';
import { StudentsPage } from '@/views/students';

const Students = async () => {
  const [initialClubsData] = await Promise.all([getClubs()]);

  return <StudentsPage initialClubsData={initialClubsData} />;
};

export default Students;
