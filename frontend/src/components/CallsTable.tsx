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
} from '@chakra-ui/react';
import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CallData, PRIORITIES, STATUSES } from '../types/calls';
import { Info } from './Info';
import { StatusIndicator } from './StatusIndicator';

const headers = ['Live', 'Priority', 'Who', 'What', 'When', 'Where', 'Status', ''];

interface TrProps {
  selected: boolean;
  data: CallData;
  onClick: (data: CallData) => void;
}

const TableRow: React.FC<TrProps> = ({ data, selected, onClick }) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: data.live,
  });

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
        <Td>
          {' '}
          <StatusIndicator active={data.live} />{' '}
        </Td>
        <Td>
          <Badge colorScheme={PRIORITIES?.[data.priority]?.color}>{data.priority}</Badge>
        </Td>
        <Td>
          {data.name} <br />({data.phone})
        </Td>
        <Td>{data.emergency}</Td>
        <Td>{new Date(data.dateCreated).toLocaleTimeString()}</Td>
        <Td>{data.location}</Td>
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
            <Text as="cite">{data.transcript}</Text>
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
      maxH="70vh"
      maxW={{ base: 'full', lg: 'xl', xl: '3xl', '2xl': 'unset' }}
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
            <Td bg="white" colSpan={headers.length}>
              <Info text="No Data Found" />
            </Td>
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
