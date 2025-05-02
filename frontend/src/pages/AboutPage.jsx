import React from 'react';
import { Box, Text, Image, Heading, VStack } from '@chakra-ui/react';
import WelcomeHeader from '../components/WelcomeHeader';

const AboutPage = () => {
  return (
    <>
      <WelcomeHeader />
      
      {/* Image container with overlayed text */}
      <Box position="relative" display="flex" justifyContent="center" alignItems="center" mt={8}>
        <Image
          src="/pexels-fmaderebner-745988.jpg" // Replace with your image path
          alt="About Us"
          objectFit="cover"
          width="100%"
          maxH="300px"
        />
        
        {/* Overlayed Text */}
        <Heading
          fontFamily="'Rubik Dirt', system-ui"
          position="absolute"
          color="white"
          fontSize="6xl"
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="center"
        >
          Our Story
        </Heading>
      </Box>

      {/* Centered Heading and Paragraph */}
      <VStack spacing={4} mt={8} textAlign="center">
        <Heading fontSize="2xl" fontWeight="bold" textTransform="uppercase" fontFamily="'Rubik Dirt', system-ui">
          Helping in Our Mission
        </Heading>
        <Text fontSize="lg" maxW="600px">
          With the challenges facing our country, we offer this platform as a way for people to come together and support each other with various issues.
        </Text>
      </VStack>

        {/* Footer message at the bottom */}
        <Box as="footer" mt="auto" py={9} textAlign="center" color="gray.600" fontSize="sm">
        <Text>&copy; {new Date().getFullYear()} TeamUp. All rights reserved.</Text>
        <Text>Empowering communities through support and solidarity.</Text>
      </Box>
    </>
  );
};

export default AboutPage;
