import { Container, SimpleGrid, Text, chakra, Box, Grid, GridItem } from '@chakra-ui/react';
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
import { Map } from './components/Maps/Map';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Marker } from './components/Maps/Marker';

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

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  const center = {
    lat: -15.77,
    lng: -44.233,
  };
  const zoom = 10;
  return (
    <Container maxW="8xl" mr="0" pr="0">
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem colSpan={2}>
          <Box maxW="3xl">
            <chakra.h1 textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
              AssembyAI Hackathon
            </chakra.h1>
            {error ? <Text>Error: {error.message}</Text> : null}
            <SimpleGrid mb="10" columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
              <StatsCard bg="yellow.100" title={'Users'} stat={'5,000'} icon={<BsPerson size={'3em'} />} />
              <StatsCard bg="red.100" title={'Servers'} stat={'1,000'} icon={<FiServer size={'3em'} />} />
              <StatsCard bg="green.100" title={'Datacenters'} stat={'7'} icon={<GoLocation size={'3em'} />} />
            </SimpleGrid>
          </Box>
          {!loading && snapshots ? <CallsTable onRowClick={handleClick} calls={snapshots} /> : null}
        </GridItem>
        <GridItem colStart={4} colEnd={6}>
          <Wrapper apiKey={'AIzaSyBWCLdCVQ1siM_M5zExHqsMLItO_nUvT4U'} render={render}>
            <Map
              style={{
                width: '600px',
                height: '100%',
              }}
              center={center}
              zoom={zoom}
            >
              <Marker position={center} />
            </Map>
          </Wrapper>
        </GridItem>
      </Grid>
    </Container>
  );
}

export default App;
