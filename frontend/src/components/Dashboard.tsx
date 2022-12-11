import { SimpleGrid, Text, chakra, Box, Skeleton, Flex, Badge } from '@chakra-ui/react';

import { AiOutlinePhone, AiOutlineClockCircle, AiOutlineFolderOpen } from 'react-icons/ai';
import { useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { BsCheck2Circle } from 'react-icons/bs';
import { CallData, PRIORITIES, STATUSES } from '../types/calls';
import { StatsCard } from './StatsCard';
import { Map } from './Maps/Map';
import { Marker } from './Maps/Marker';
import CallsTable from './CallsTable';
import { FAQ } from './FAQ';

const filterCallsBasedOnStatus = (calls: CallData[], status: keyof typeof STATUSES | undefined) => {
  switch (status) {
    case STATUSES.OPEN.key:
      return calls.filter((call) => call.status === STATUSES.OPEN.key);
    case STATUSES.DISPATCHED.key:
      return calls.filter((call) => call.status === STATUSES.DISPATCHED.key);
    case STATUSES.RESOLVED.key:
      return calls.filter((call) => call.status === STATUSES.RESOLVED.key);
    default:
      return calls.filter((call) => call.status !== STATUSES.RESOLVED.key);
  }
};

export const Dashboard = ({
  calls,
  loading,
  error,
}: {
  calls: CallData[] | undefined;
  loading: boolean;
  error: Error | undefined;
}) => {
  const [status, setStatus] = useState<keyof typeof STATUSES>();
  const [selectedRow, setSelectedRow] = useState<CallData>();

  const handleClick = async (call: CallData) => {
    setSelectedRow(call);
  };

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  if (!calls || loading)
    return (
      <Box mx="auto" maxW="4xl">
        <Flex justifyContent="space-between">
          <Skeleton w="200px" h="100px" />
          <Skeleton w="200px" h="100px" />
          <Skeleton w="200px" h="100px" />
          <Skeleton w="200px" h="100px" />
        </Flex>
        <Flex flexDirection="column" gap="10px" pt="10">
          <Skeleton pt="20px" w="full" h="30px" />
          <Skeleton pt="20px" w="full" h="30px" />
          <Skeleton pt="20px" w="full" h="30px" />
          <Skeleton pt="20px" w="full" h="30px" />
          <Skeleton pt="20px" w="full" h="30px" />
        </Flex>
      </Box>
    );

  const unresolved = calls.filter((call) => call.status !== STATUSES.RESOLVED.key);
  const open = calls.filter((call) => call.status === STATUSES.OPEN.key);
  const dispatched = calls.filter((call) => call.status === STATUSES.DISPATCHED.key);
  const resolved = calls.filter((call) => call.status === STATUSES.RESOLVED.key);

  const filteredCalls = filterCallsBasedOnStatus(calls, status);

  return (
    <Box id="dashboard" p={{ md: 8 }} w={{ md: '75vw' }} minH={'100vh'} mx={'auto'}>
      <Box w={'full'} mb={8}>
        <Box>
          <chakra.h1 textAlign={'left'} fontSize={'4xl'} pt={10} fontWeight={'bold'}>
            OperatorAI
            <Badge ml={2} mt={-5} fontSize="0.4em" colorScheme="purple">
              Alpha
            </Badge>
          </chakra.h1>
          {error ? <Text>Error: {error.message}</Text> : null}
          <SimpleGrid py="8" columns={{ base: 2, lg: 4 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              active={!status}
              bg="gray.100"
              title={'Unresolved'}
              stat={unresolved.length.toString()}
              icon={<AiOutlinePhone color="gray" size={'1em'} />}
              onClick={() => setStatus(undefined)}
            />
            <StatsCard
              active={status === STATUSES.OPEN.key}
              bg="cyan.100"
              title={'Open'}
              stat={open.length.toString()}
              icon={<AiOutlineFolderOpen color="#00A3C4" size={'1em'} />}
              onClick={() => setStatus(STATUSES.OPEN.key)}
            />
            <StatsCard
              active={status === STATUSES.DISPATCHED.key}
              bg={`orange.100`}
              title={'Dispatched'}
              stat={dispatched.length.toString()}
              icon={<AiOutlineClockCircle color="#B7791F" size={'1em'} />}
              onClick={() => setStatus(STATUSES.DISPATCHED.key)}
            />
            <StatsCard
              active={status === STATUSES.RESOLVED.key}
              bg={`${STATUSES.RESOLVED.color}.100`}
              title={'Resolved'}
              stat={resolved.length.toString()}
              icon={<BsCheck2Circle color={STATUSES.RESOLVED.color} size={'1em'} />}
              onClick={() => setStatus(STATUSES.RESOLVED.key)}
            />
          </SimpleGrid>
        </Box>
        {!loading && filteredCalls ? (
          <CallsTable selectedRowKey={selectedRow?.key} onRowClick={handleClick} calls={filteredCalls} />
        ) : null}
      </Box>
      <Box
        id="map"
        w={'full'}
        h="50vh"
        mb={8}
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
      <FAQ />
    </Box>
  );
};
