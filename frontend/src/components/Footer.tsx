import { Badge, Box, chakra, Container, Stack, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { ReactNode } from 'react';
import { BsGlobe } from 'react-icons/bs';

const SocialButton = ({ children, label, href }: { children: ReactNode; label: string; href: string }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export function Footer() {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <chakra.h1 textAlign={'left'} fontSize={'2xl'} fontWeight={'bold'}>
          OperatorAI
          <Badge ml={2} mt={-5} fontSize="0.35em" colorScheme="purple">
            Alpha
          </Badge>
        </chakra.h1>
        <Text>Project Submission to AssemblyAI $50K AI Hackathon</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'OperatorAI'} href={'https://www.operatorai.tech/'}>
            <BsGlobe />
          </SocialButton>
          <SocialButton label={'Github'} href={'https://github.com/dtemir/assembly-ai-hackathon'}>
            <FaGithub />
          </SocialButton>
          <SocialButton label={'Devpost'} href={'https://devpost.com/software/draft-w86vkc'}>
            <svg role="img" viewBox="-6 -6 36 36" xmlns="http://www.w3.org/2000/svg">
              <title>Devpost</title>
              <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853Z" />
            </svg>
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
