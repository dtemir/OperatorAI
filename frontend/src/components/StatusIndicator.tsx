import { Box, Flex, keyframes, Tooltip } from '@chakra-ui/react';
import { BsFillCircleFill } from 'react-icons/bs';

interface StatusIndicatorProps {
  active: boolean;
}
export const StatusIndicator = ({ active }: StatusIndicatorProps) => {
  const activeColor = 'green';
  const ringScaleMin = 0.33;
  const ringScaleMax = 0.66;

  const pulseRing = keyframes`
	0% {
    transform: scale(${ringScaleMin});
  }
	30% {
		transform: scale(${ringScaleMax});
	},
  40%,
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
	`;

  const pulseDot = keyframes`
	0% {
    transform: scale(0.9);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(0.9);
  }
	`;

  return (
    <Flex justifyContent="center" alignItems="center" h="24px" w="full" flexDir="column">
      {/* Ideally, only the box should be used. The <Flex /> is used to style the preview. */}
      {active ? (
        <Tooltip label={`Live Call`} textTransform="capitalize">
          <Box
            as="div"
            h="12px"
            w="12px"
            position="relative"
            bgColor={activeColor}
            borderRadius="50%"
            _before={{
              content: "''",
              position: 'relative',
              display: 'block',
              width: '300%',
              height: '300%',
              boxSizing: 'border-box',
              marginLeft: '-100%',
              marginTop: '-100%',
              borderRadius: '50%',
              bgColor: activeColor,
              animation: `1s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
            }}
            _after={{
              animation: `1s ${pulseDot} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
            }}
          />
        </Tooltip>
      ) : (
        <BsFillCircleFill color="red" />
      )}
    </Flex>
  );
};
