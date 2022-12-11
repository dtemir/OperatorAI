import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react';

export function FAQ() {
  const faqs = [
    {
      q: `What is the OperatorAI system?`,
      a: `The OperatorAI system is a tool that allows people to talk to an AI assistant if there are no available 911 operators. It allows individuals to quickly and easily report an emergency situation and get help.`,
    },
    {
      q: `How does the OperatorAI system work?`,
      a: `When a person calls 911 and there are no operators available, the OperatorAI system will answer the call and ask the caller to describe their emergency situation. The AI will listen to the caller's answers and use keywords to determine the severity of the situation. It will then record the caller's location and transcript of the call, and will prioritize the call based on the information provided.`,
    },
    {
      q: `Can the OperatorAI system handle all types of emergencies?`,
      a: `The OperatorAI system is designed to handle a wide range of emergency situations, but it may not be able to handle every type of emergency. In cases where the AI is unable to assist, it will hand over the call to a 911 operator as soon as one becomes available.`,
    },
    {
      q: `How is the OperatorAI system able to determine the severity of an emergency situation?`,
      a: `The OperatorAI system uses keywords in the caller's answers to determine the severity of the situation. For example, if a caller mentions that they are injured, bleeding, or in pain, the AI will consider the situation to be more severe and will prioritize the call accordingly.`,
    },
    {
      q: `Can the OperatorAI system provide medical advice or assistance?`,
      a: `No, the OperatorAI system is not designed to provide medical advice or assistance. Its primary purpose is to gather information about the emergency situation and prioritize the call for a 911 operator. It is not a substitute for professional medical care.`,
    },
    {
      q: `* Should we use this instead of 911?`,
      a: 'NO! OperatorAI is for testing purposes only. OperatorAI is a proof of concept project and is not intended to replace real emergency services. Please call official 911 Emergency Services if you are in danger.',
    },
  ];

  return (
    <Box id="faq">
      <Heading as="h2" size="md" mb={4}>
        Frequently Asked Questions
      </Heading>
      <Box rounded={'2xl'} bg="white" shadow={'xl'} overflow={'hidden'} border="1px solid" borderColor="blackAlpha.200">
        <Accordion defaultIndex={[0]}>
          {faqs.map(({ q, a }, idx) => (
            <AccordionItem key={idx}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight={'bold'}>
                    {q}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{a}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Box>
  );
}
