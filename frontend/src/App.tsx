import { Container, Spinner, Text } from '@chakra-ui/react';
import { ref } from 'firebase/database';
import { useListVals } from 'react-firebase-hooks/database';

import { db } from './firebaseConfig';

import { CallData } from './types/calls';

import { Dashboard } from './components/Dashboard';
import { Landing } from './components/Landing';
import { Footer } from './components/Footer';

import './index.css';

export interface MapCoordinates {
  name: string;
  location: Location;
}

function App() {
  const [values, loading, error] = useListVals<CallData>(ref(db, 'calls'));

  const calls: CallData[] | undefined = values
    ?.map((call) => ({ ...call, key: call.callSid }))
    .filter(({ key }) => !!key);

  return (
    <Container bg="gray.50" minH="100vh" maxW="10xl" mx="0" pr={{ base: '4', lg: '0' }}>
      <Landing />]{loading ? <Spinner size="xl" /> : null}
      {calls ? <Dashboard calls={calls} loading={loading} error={error} /> : null}
      <Footer />
    </Container>
  );
}

export default App;
