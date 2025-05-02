import React from 'react';
import { Box, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import WelcomeHeader from '../components/WelcomeHeader';

const featuresData = [
  {
    title: "Help People Find Shelter",
    description: "Users can create and search for posts related to various needs and offers for help. This feature serves as the heart of the platform, allowing community members to share their problems and offers.",
    videoSrc: "/feature3.mp4",
  },
  {
    title: "Donate Blood",
    description: "A dedicated feature for users to offer blood donations or seek blood in emergencies, connecting donors with those in need efficiently.",
    videoSrc: "/feature2.mp4",
  },
  {
    title: "Need Medical Supplies",
    description: "Users can post requests for medical supplies, ensuring those affected by crises have access to essential resources.",
    videoSrc: "/feature1.mp4",
  },
];

const FeaturesPage = () => {
  return (
    <>
      <WelcomeHeader />
      <Box p={8} display="flex" flexDirection="column" gap={8}>
        {featuresData.map((feature, index) => (
          <Flex
            key={index}
            direction={{ base: "column", md: "row" }}
            align="center"
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            {/* Video Box */}
            <Box 
              flexShrink={0} 
              mr={{ base: 0, md: 8 }} 
              mb={{ base: 4, md: 0 }} 
              boxSize={{ base: "200px", md: "150px" }}
              overflow="hidden"
              borderRadius="full"
            >
              <video
                src={feature.videoSrc}
                autoPlay
                loop
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />
            </Box>

            {/* Text Box */}
            <VStack spacing={3} align="flex-start" flex="1">
              <Heading as="h2" size="lg" fontFamily="'Playwrite DK Uloopet', sans-serif">
                {feature.title}
              </Heading>
              <Text fontSize="md">
                {feature.description}
              </Text>
            </VStack>
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default FeaturesPage;
