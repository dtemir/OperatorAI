import { Container, Spinner } from '@chakra-ui/react';
import { ref } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';

import { db } from './firebaseConfig';

import { CallData } from './types/calls';

import { Dashboard } from './components/Dashboard';

export interface MapCoordinates {
  name: string;
  location: Location;
}

function App() {
  const [snapshots, loading, error] = useList(ref(db, 'calls'));

  const calls: CallData[] | undefined = snapshots?.map((call) => ({ key: call.key, ...call.val() }));

  return (
    <Container bg="gray.50" minH="100vh" maxW="10xl" mx="0" pr={{ base: '4', lg: '0' }}>
      {loading ? <Spinner size="xl" /> : null}
      {calls && calls.length ? <Dashboard calls={calls} loading={loading} error={error} /> : null}
    </Container>
  );
}

export default App;
