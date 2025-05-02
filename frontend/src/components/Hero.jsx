import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../button.scss"

import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function Hero({
  title,
  videoSrc,
  ctaLink,
  ctaText,
  ...rest
}) {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="50vh"
      px={8}
      mb={16}
      {...rest}
    >
      <Stack
        spacing={10}
        w={{ base: "80%", md: "40%" }}
        align={["center", "center", "flex-start", "flex-start"]}
      >
        <Stack spacing={1} textAlign={["center", "center", "left", "left"]}>
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          color="primary.800"
          fontFamily="'Playwrite DK Uloopet', sans-serif"
        >
          TeamUp
        </Heading>
          <Text
            fontSize="2xl" // Adjust the size as needed
            fontWeight="bold"
            color="primary.900"
            opacity="1"
          >
            A Social Support Network
          </Text>
        </Stack>
        
        <Text
          fontSize="lg"
          color="primary.800"
          opacity="0.9"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          Your Community Help Platform for Crisis Support and Resources.
        </Text>

        <Link to={ctaLink}>
        <button className="button">
          {ctaText}
          <span className="button__horizontal"></span>
          <span className="button__vertical"></span>
        </button>
        </Link>
       
      </Stack>
      <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          style={{ width: '100%', borderRadius: '1rem', boxShadow: '2xl', pointerEvents: 'none' }}
        />
      </Box>
    </Flex>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  videoSrc: PropTypes.string, // Changed from image to videoSrc
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
};

Hero.defaultProps = {
  title: "TeamUp",
  videoSrc: "/giving.mp4", // Set a default video path
  ctaText: "Create your account now",
  ctaLink: "/signup",
};
