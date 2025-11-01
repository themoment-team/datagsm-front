import { getApiKey, getApiKeyRenewable } from '@/entities/home';
import { HomePage } from '@/views/home';

const Home = async () => {
  const [initialApiKeyData, initialApiKeyRenewableData] = await Promise.all([
    getApiKey(),
    getApiKeyRenewable(),
  ]);

  return (
    <HomePage
      initialApiKeyData={initialApiKeyData}
      initialApiKeyRenewableData={initialApiKeyRenewableData}
    />
  );
};

export default Home;
