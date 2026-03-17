import { getMyAccountInfo } from '@/views/mypage/api/getMyInfo';
import MyInfoPage from '@/views/mypage/ui/MyInfoPage';

const MyInfo = async () => {
  const myData = await getMyAccountInfo();

  return <MyInfoPage initialData={myData} />;
};

export default MyInfo;
