import { Box, Flex, Stat, StatLabel, StatNumber, StatProps, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface StatsCardProps extends StatProps {
  title: string;
  stat: string;
  icon: ReactNode;
}
export const StatsCard = (props: StatsCardProps) => {
  const { title, stat, icon, ...rest } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'8'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'2xl'}
      {...rest}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'}>{title}</StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box my={'auto'} color={useColorModeValue('gray.800', 'gray.200')} alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};
