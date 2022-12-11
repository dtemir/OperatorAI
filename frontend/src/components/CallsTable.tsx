import {
  Badge,
  Box,
  Collapse,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
  Select,
  HStack,
  Stack,
  Flex,
  Button,
  Image,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { ref, set } from 'firebase/database';
import { db } from '../firebaseConfig';
import { CallData, EMERGENCIES, PRIORITIES, STATUSES } from '../types/calls';
import { Info } from './Info';
import { StatusIndicator } from './StatusIndicator';

const headers = ['Priority', 'Caller', 'Emergency', 'Time', 'Location', 'Status', ''];

interface TrProps {
  selected: boolean;
  data: CallData;
  onClick: (data: CallData) => void;
}

function updateField(callSid: string, key: string, value: string) {
  set(ref(db, `/calls/${callSid}/${key}`), value);
}

const TableRow: React.FC<TrProps> = ({ data, selected, onClick }) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: data.live,
  });

  const regex = /(\d{3})(\d{3})(\d{4})$/;
  const [, firstGroup, secondGroup, thirdGroup] = regex.exec(data.phone) ?? [];

  const formattedPhone = `(${firstGroup}) ${secondGroup}-${thirdGroup}`;

  return (
    <>
      <Tr
        cursor="pointer"
        _hover={{
          bg: 'blackAlpha.100',
        }}
        bg={selected ? 'blue.50' : 'white'}
        onClick={() => onClick(data)}
      >
        <Td textAlign="left" w="30px" pl="5">
          <Badge colorScheme={PRIORITIES?.[data.priority]?.color}>{data.priority}</Badge>
        </Td>
        <Td>
          <Flex alignItems={'center'}>
            <Box mr={3}>
              <StatusIndicator active={data.live} />
            </Box>
            <Box mr={5}>
              <strong>{data.name}</strong>
              <br />
              <em>{formattedPhone}</em>
            </Box>
            <Button size="sm" color="green.600" as={Link} href={`tel:${data.phone}`}>
              {data.live ? 'Join' : 'Dial'}
            </Button>
          </Flex>
        </Td>
        <Td>{data.emergency || '-'}</Td>
        <Td>{new Date(data.dateCreated).toLocaleTimeString()}</Td>
        <Td>{data.location || '-'}</Td>
        <Td>
          <Badge colorScheme={STATUSES?.[data.status]?.color}>{data.status}</Badge>
        </Td>
        <Td onClick={onToggle}>
          <Box>{isOpen ? <FiChevronUp size="20px" /> : <FiChevronDown size="20px" />}</Box>
        </Td>
      </Tr>
      <Tr display={isOpen ? 'contents' : 'none'}>
        <Td colSpan={headers.length} bg="white">
          <Collapse in={isOpen} animateOpacity>
            <Stack direction={{ base: 'column', lg: 'row' }}>
              <VStack w={{ base: 'full', lg: '2xl' }} alignItems="left" m="2" alignSelf={'flex-start'}>
                <Text textAlign="left" fontWeight="bold" color="gray.600">
                  Transcript
                </Text>
                <Text
                  whiteSpace="pre-wrap"
                  border="1px solid"
                  fontStyle="italic"
                  borderColor="blackAlpha.100"
                  borderRadius="2xl"
                  shadow="md"
                  m="3"
                  p="3"
                >
                  {data.transcript} {data.live ? <span className="blinking-cursor">|</span> : null}
                </Text>
                {data.geocode && (
                  <Image
                    cursor="pointer"
                    borderColor="blackAlpha.100"
                    borderRadius="2xl"
                    shadow="md"
                    onClick={() => {
                      onClick(data);
                      document.querySelector('#map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    w={'3xl'}
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${data.geocode?.lat},${
                      data.geocode?.lng
                    }&zoom=16&size=500x150&maptype=roadmap
&markers=color:${PRIORITIES[data.priority]?.color}%7C${data.geocode?.lat},${data.geocode?.lng}
&key=${import.meta.env.VITE_GOOGLE_API_KEY.replace(/\n+/, '').trim()}`}
                  />
                )}
              </VStack>
              <VStack flexGrow={1} alignSelf={'center'}>
                <HStack w="sm">
                  <Text textAlign="left" fontWeight="bold" color="gray.600" w={36}>
                    Status
                  </Text>
                  <Select
                    value={data.status}
                    bg={`${STATUSES[data.status]?.color}.200`}
                    onInput={(e) => updateField(data.callSid, 'status', e.currentTarget.value)}
                  >
                    {Object.entries(STATUSES).map(([, { key: statusKey, display }]) => {
                      return (
                        <option key={statusKey} value={statusKey}>
                          {display}
                        </option>
                      );
                    })}
                  </Select>
                </HStack>
                <HStack w="sm">
                  <Text textAlign="left" fontWeight="bold" color="gray.600" w={36}>
                    Priority
                  </Text>
                  <Select
                    value={data.priority}
                    bg={`${PRIORITIES[data.priority]?.color}.200`}
                    onInput={(e) => updateField(data.callSid, 'priority', e.currentTarget.value)}
                  >
                    {Object.entries(PRIORITIES).map(([, { key: statusKey, display }]) => {
                      return (
                        <option key={statusKey} value={statusKey}>
                          {display}
                        </option>
                      );
                    })}
                  </Select>
                </HStack>
                <HStack w="sm">
                  <Text textAlign="left" fontWeight="bold" color="gray.600" w={36}>
                    Emergency
                  </Text>
                  <Select
                    value={data.emergency}
                    onInput={(e) => updateField(data.callSid, 'emergency', e.currentTarget.value)}
                  >
                    <option value={''}>Assign</option>
                    {Object.entries(EMERGENCIES).map(([, { key: statusKey, display }]) => {
                      return (
                        <option key={statusKey} value={statusKey}>
                          {display}
                        </option>
                      );
                    })}
                  </Select>
                </HStack>
              </VStack>
            </Stack>
          </Collapse>
        </Td>
      </Tr>
    </>
  );
};

const CallsTable: React.FC<{
  selectedRowKey?: string | null;
  calls: CallData[];
  onRowClick: (data: CallData) => void;
}> = ({ calls, onRowClick, selectedRowKey }) => {
  const sortDescendingByDate = calls.sort(
    (a, b) => new Date((b as CallData).dateCreated).getTime() - new Date((a as CallData).dateCreated).getTime()
  );

  const sortByLive = sortDescendingByDate.sort((a, b) => {
    return Number((b as CallData).live) - Number((a as CallData).live);
  });

  return (
    <TableContainer
      display="flex"
      maxH="90vh"
      overflowY="auto"
      border="1px solid"
      borderRadius="2xl"
      shadow="xl"
      borderColor="blackAlpha.200"
    >
      <Table size="sm">
        <Thead position="sticky" top="0" bg="white" zIndex={1} h="4rem">
          <Tr>
            {headers.map((header) => (
              <Th key={header}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {!sortByLive.length ? (
            <Tr>
              <Td bg="white" colSpan={headers.length}>
                <Info text="No Data Found" />
              </Td>
            </Tr>
          ) : (
            sortByLive.map((v) => (
              <TableRow key={v.key} selected={selectedRowKey === v.key} data={v} onClick={onRowClick} />
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CallsTable;
