import { Container, Text } from '@chakra-ui/react';
import { ref } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';
import CallsTable from './components/CallsTable';
import { db } from './firebaseConfig';

function App() {
  const [snapshots, loading, error] = useList(ref(db, 'calls'));

  return (
    <Container maxW={'8xl'}>
      <Text fontSize="2xl">Assembly AI</Text>
      {error ? <Text>Error: {error.message}</Text> : null}
      {!loading && snapshots ? <CallsTable calls={snapshots} /> : null}
    </Container>
  );
}

export default App;
