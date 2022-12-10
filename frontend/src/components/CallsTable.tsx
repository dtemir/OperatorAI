import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { DataSnapshot } from 'firebase/database';
import React, { Fragment } from 'react';
import { BsFillCircleFill } from 'react-icons/bs';
import { CallData, PRIORITIES, STATUS_COLORS } from '../types/calls';

const headers = ['Priority', 'Who', 'What', 'When', 'Where', 'Live', 'Status', ''];

interface TrProps {
  data: CallData;
  onClick: (data: CallData) => void;
}

const TableRow: React.FC<TrProps> = ({ data, onClick }) => {
  return (
    <AccordionItem as={Fragment}>
      {({ isExpanded }) => (
        <>
          <Tr onClick={() => onClick(data)}>
            <Td>
              <AccordionButton>
                <AccordionIcon />
              </AccordionButton>
            </Td>
            <Td>
              <Badge colorScheme={PRIORITIES?.[data.priority]?.color}>{PRIORITIES?.[data.priority]?.label}</Badge>
            </Td>
            <Td>
              {data.name} ({data.phone})
            </Td>
            <Td>{data.emergency}</Td>
            <Td>{new Date(data.created).toLocaleString()}</Td>
            <Td>{data.location}</Td>
            <Td>
              <BsFillCircleFill color={data.live ? 'green' : 'red'} />
            </Td>
            <Td>
              <Badge colorScheme={STATUS_COLORS[data.status]}>{data.status}</Badge>
            </Td>
          </Tr>
          <Tr display={isExpanded ? 'contents' : 'none'}>
            <Td colSpan={headers.length}>
              <AccordionPanel>{data.transcript}</AccordionPanel>
            </Td>
          </Tr>
        </>
      )}
    </AccordionItem>
  );
};

const CallsTable: React.FC<{
  calls: DataSnapshot[];
  onRowClick: (data: CallData) => void;
}> = ({ calls, onRowClick }) => {
  const openedAccordionsByDefault = calls.reduce((acc: number[], curr, i) => {
    if ((curr.val() as CallData).live) acc.push(i);
    return acc;
  }, []);
  return (
    <TableContainer maxW={'3xl'} border="1px solid" borderRadius="2xl" borderColor="blackAlpha.200">
      <Table variant={'simple'} size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            {headers.map((header) => (
              <Th key={header}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Accordion as={Fragment} allowMultiple defaultIndex={openedAccordionsByDefault}>
            {calls.map((v) => (
              <TableRow key={v.key} data={v.val() as CallData} onClick={onRowClick} />
            ))}
          </Accordion>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CallsTable;
