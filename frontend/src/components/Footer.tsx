import { Badge, Box, chakra, Container, Stack, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import { CgWebsite } from 'react-icons/cg';
import { FaGithub } from 'react-icons/fa';
import { ReactNode } from 'react';

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
            <CgWebsite />
          </SocialButton>
          <SocialButton label={'Github'} href={'https://github.com/dtemir/assembly-ai-hackathon'}>
            <FaGithub />
          </SocialButton>
          <SocialButton label={'Instagram'} href={'https://devpost.com/software/draft-w86vkc'}>
            <img
              alt="Devpost"
              src="https://q9k6x7m8.stackpathcdn.com/assets/reimagine2/devpost-logo-646bdf6ac6663230947a952f8d354cad.svg"
            />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
