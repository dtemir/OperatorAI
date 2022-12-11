import { SimpleGrid, Text, chakra, Box, Flex, Badge } from '@chakra-ui/react';

import { AiOutlinePhone, AiOutlineClockCircle } from 'react-icons/ai';
import { useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { BsCheck2Circle } from 'react-icons/bs';
import { CallData, PRIORITIES, STATUSES } from '../types/calls';
import { StatsCard } from './StatsCard';
import { Map } from './Maps/Map';
import { Marker } from './Maps/Marker';
import CallsTable from './CallsTable';

export const Dashboard = ({
  calls,
  loading,
  error,
}: {
  calls: CallData[];
  loading: boolean;
  error: Error | undefined;
}) => {
  const [tableView, setTableView] = useState<keyof typeof STATUSES>();
  const [selectedRow, setSelectedRow] = useState<CallData>();

  const handleClick = async (call: CallData) => {
    setSelectedRow(call);
  };

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  const dispatched = calls.filter((call) => call.status === STATUSES.DISPATCHED.key);
  const resolved = calls.filter((call) => call.status === STATUSES.RESOLVED.key);

  const filteredCalls =
    tableView === STATUSES.DISPATCHED.key ? dispatched : tableView === STATUSES.RESOLVED.key ? resolved : calls;

  return (
    <Flex p={8} w={'75vw'} h={'100vh'} mx={'auto'} flexDirection="column" gap={8}>
      <Box maxH="50vh">
        <Box>
          <chakra.h1 textAlign={'left'} fontSize={'4xl'} pt={10} fontWeight={'bold'}>
            OperatorAI
            <Badge ml={2} mt={-5} fontSize="0.4em" colorScheme="purple">
              Alpha
            </Badge>
          </chakra.h1>
          {error ? <Text>Error: {error.message}</Text> : null}
          <SimpleGrid py="8" columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              active={!tableView}
              bg="cyan.100"
              title={'Calls'}
              stat={calls.length.toString()}
              icon={<AiOutlinePhone color="blue" size={'1em'} />}
              onClick={() => setTableView(undefined)}
            />
            <StatsCard
              active={tableView === STATUSES.DISPATCHED.key}
              bg="red.100"
              title={'Dispatched'}
              stat={dispatched.length.toString()}
              icon={<AiOutlineClockCircle color="red" size={'1em'} />}
              onClick={() => setTableView(STATUSES.DISPATCHED.key)}
            />
            <StatsCard
              active={tableView === STATUSES.RESOLVED.key}
              bg="green.100"
              title={'Resolved'}
              stat={resolved.length.toString()}
              icon={<BsCheck2Circle color="green" size={'1em'} />}
              onClick={() => setTableView(STATUSES.RESOLVED.key)}
            />
          </SimpleGrid>
        </Box>
        {!loading && filteredCalls ? (
          <CallsTable selectedRowKey={selectedRow?.key} onRowClick={handleClick} calls={filteredCalls} />
        ) : null}
      </Box>
      <Box
        flex={1}
        rounded={'2xl'}
        bg="white"
        shadow={'xl'}
        overflow={'hidden'}
        border="1px solid"
        borderColor="blackAlpha.200"
      >
        <Wrapper apiKey={import.meta.env.VITE_GOOGLE_API_KEY} render={render}>
          <Map
            style={{
              height: '100%',
            }}
            center={
              selectedRow?.geocode ?? {
                lat: 37.7623985,
                lng: -122.465668,
              }
            }
            zoom={selectedRow?.geocode ? 18 : 12}
          >
            {filteredCalls.map((call) => {
              if (call.status === STATUSES.RESOLVED.key) return null;
              if (!PRIORITIES?.[call.priority]?.color) return null;
              return (
                <Marker
                  key={call.key}
                  position={call.geocode}
                  icon={{
                    url: `http://maps.google.com/mapfiles/ms/icons/${PRIORITIES?.[call.priority]?.color}-dot.png`,
                  }}
                />
              );
            })}
          </Map>
        </Wrapper>
      </Box>
    </Flex>
  );
};
