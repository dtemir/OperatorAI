import { Box, Flex, Stat, StatLabel, StatNumber, StatProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface StatsCardProps extends StatProps {
  title: string;
  stat: string;
  icon: ReactNode;
  active: boolean;
}

export const StatsCard = (props: StatsCardProps) => {
  const { title, stat, icon, bg, active, ...rest } = props;
  return (
    <Stat
      cursor="pointer"
      px={{ base: 2, md: 4 }}
      py={'4'}
      rounded={'2xl'}
      bg="white"
      borderWidth={'2px'}
      borderColor={active ? 'blackAlpha.400' : 'transparent'}
      shadow={active ? '2xl' : 'md'}
      {...rest}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <Flex alignItems="start" gap={2}>
            <Box bg={bg} p="1" borderRadius="md" alignContent={'center'}>
              {icon}
            </Box>
            <Box>
              <StatLabel fontWeight={'medium'} color="gray.400">
                {title}
              </StatLabel>
              <StatNumber fontSize={'2xl'} fontWeight={'bold'}>
                {stat}
              </StatNumber>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Stat>
  );
};
