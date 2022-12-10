import { Container, SimpleGrid, Text, chakra } from '@chakra-ui/react';
import { ref } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';
import CallsTable from './components/CallsTable';
import { StatsCard } from './components/StatsCard';
import { db } from './firebaseConfig';
import { BsPerson } from 'react-icons/bs';
import { FiServer } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';
import { useState } from 'react';
import { CallData } from './types/calls';

export interface MapCoordinates {
  name: string;
  location: Location;
}
function App() {
  const [snapshots, loading, error] = useList(ref(db, 'calls'));
  const [, setMapCoordinates] = useState<CallData>();

  const handleClick = async (data: CallData) => {
    setMapCoordinates(data);
  };

  return (
    <Container maxW="8xl" minH="100vh">
      <Container maxW="3xl">
        <chakra.h1 textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
          AssembyAI Hackathon
        </chakra.h1>
        {error ? <Text>Error: {error.message}</Text> : null}
        <SimpleGrid mb="10" columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          <StatsCard bg="yellow.100" title={'Users'} stat={'5,000'} icon={<BsPerson size={'3em'} />} />
          <StatsCard bg="red.100" title={'Servers'} stat={'1,000'} icon={<FiServer size={'3em'} />} />
          <StatsCard bg="green.100" title={'Datacenters'} stat={'7'} icon={<GoLocation size={'3em'} />} />
        </SimpleGrid>
      </Container>
      {!loading && snapshots ? <CallsTable onRowClick={handleClick} calls={snapshots} /> : null}
    </Container>
  );
}

export default App;
