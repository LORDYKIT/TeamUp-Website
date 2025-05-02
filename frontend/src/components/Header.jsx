import { Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom"; // Import Link for routing

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Include the Google Fonts link here */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playwrite+DK+Uloopet:wght@100;200;300;400&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <Flex 
        justifyContent="center" 
        alignItems="center" 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000} // Ensure the header stays on top of other content
        bg="transparent"
        backdropFilter="blur(10px)" // Optional: Change background based on color mode
        py={2} // Use padding instead of margin
      >
        <Image
          cursor="pointer"
          alt="logo"
          w={10}  // Increase the width (adjust the size here)
          h={10} 
          src={colorMode === "dark" ? "/output-onlinepngtools (3).png" : "/hands 3.png"}
          onClick={toggleColorMode}
          mr={2} // Margin to separate logo from the app name
        />

        <Link to="/homepage" style={{ display: "flex", alignItems: "center" }} onClick={handleLinkClick}>
          <Text
          fontSize="2xl"
          cursor="pointer"
          fontWeight="bold"
          color="primary.800"
          fontFamily="'Playwrite DK Uloopet', sans-serif" // Apply your custom class here
          >
            TeamUp
          </Text>
        </Link>

        {/* Define your custom styles directly in your component */}
        <style>
          {`
            .playwrite-dk-uloopet-1 {
              font-family: "Playwrite DK Uloopet", system-ui;
              font-optical-sizing: auto;
              font-weight: 400;
              font-style: normal; // Change this as needed (100, 200, 300, or 400)
            }
          `}
        </style>
      </Flex>
    </>
  );
};

export default Header;
