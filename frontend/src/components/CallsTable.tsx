import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { DataSnapshot } from 'firebase/database';
import React from 'react';

type CallData = {
  name: string;
  created: string;
  emergency: string;
  location: string;
  phone: string;
  priority: number;
  status: string;
  transcript?: string;
};

const TableRow: React.FC<{ data: CallData }> = ({ data }) => {
  return (
    <Tr>
      <Td>
        {data.name} ({data.phone})
      </Td>
      <Td>{data.emergency}</Td>
      <Td>{new Date(data.created).toLocaleDateString('en')}</Td>
      <Td>{data.location}</Td>
      <Td>{data.priority}</Td>
      <Td>{data.status}</Td>
    </Tr>
  );
};

const CallsTable: React.FC<{
  calls: DataSnapshot[];
}> = ({ calls }) => {
  return (
    <TableContainer>
      <Table variant={'simple'}>
        <Thead>
          <Tr>
            <Th>Who</Th>
            <Th>What</Th>
            <Th>When</Th>
            <Th>Where</Th>
            <Th>Priority</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {calls.map((v) => (
            <TableRow key={v.key} data={v.val() as CallData} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CallsTable;
