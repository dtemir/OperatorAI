import { Container, Text } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { useList } from 'react-firebase-hooks/database';
import { DataSnapshot, ref } from 'firebase/database';
import React from 'react';

const query = ref(db, 'calls');

const CallsTable: React.FC<{ data: DataSnapshot[] }> = ({ data }) => {
  return (
    <>
      {data.map((v) => (
        <Container key={v.key}>
          <Text>{v.key}</Text>
          <Text>{JSON.stringify(v.val(), null, 2)}</Text>
        </Container>
      ))}
    </>
  );
};

function App() {
  const [snapshots, loading, error] = useList(query);

  return (
    <Container>
      <Text fontSize="2xl">Assembly AI</Text>
      {error ? <Text>Error: {error.message}</Text> : null}
      {!loading && snapshots ? <CallsTable data={snapshots} /> : null}
    </Container>
  );
}

export default App;
