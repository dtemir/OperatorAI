import { Flex, Heading } from '@chakra-ui/react';
import { HiInformationCircle } from 'react-icons/hi';
export const Info = ({ text }: { text: string }) => {
  return (
    <Flex bg="white" flexDirection="column" w="full" alignItems="center" textAlign="center" py={10} px={6}>
      <HiInformationCircle size={'50px'} color={'blue'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {text}
      </Heading>
    </Flex>
  );
};
