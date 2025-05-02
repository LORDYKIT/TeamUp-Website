import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

const MenuItems = (props) => {
  const { children, isLast, to = "/", ...rest } = props;
  return (
    <Text
      mb={{ base: isLast ? 0 : 8, sm: 0 }} // Controls vertical space between items in mobile view
      mr={{ base: 0, sm: isLast ? 0 : 12 }} // Controls horizontal space between items in larger screens
      display="block"
      {...rest}
    >
      <Link to={to}>{children}</Link>
    </Text>
  );
};

const WelcomeHeader = (props) => {
  const bgColor = useColorModeValue("gray.100", "#101010"); // Light: gray.100, Dark: gray.800
  const textColor = useColorModeValue("black", "white"); // Text color based on mode
  const buttonBg = useColorModeValue("gray.200", "gray.900"); // Light mode: blue.500, Dark mode: gray.800
  const buttonTextColor = useColorModeValue("gray.700", "gray.100"); // Button text color for light/dark mode

  const [show, setShow] = React.useState(false);
  const toggleMenu = () => setShow(!show);

  return (
    <Flex
      as="nav"
      align="center"
      justify="center" // Center the menu items
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={bgColor}
      color={textColor}
      {...props}
    >
      {/* Hamburger Icon for small screens */}
      <Box display={{ base: "block", md: "none" }} onClick={toggleMenu}>
        {show ? <CloseIcon /> : <HamburgerIcon />}
      </Box>

      {/* Menu Items */}
      <Box
        display={{ base: show ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
        
      >
        <Flex
          align="center"
          justify="center"
          direction={{ base: "column-reverse", md: "row" }}
          wrap="no-wrap"
          pt={[4, 4, 0, 0]}
          fontFamily="'Playwrite DK Uloopet', sans-serif"
        >

          <MenuItems to="/" className="stroke">Home</MenuItems>
          <MenuItems to="/features" className="stroke">Features</MenuItems>
          <MenuItems to="/about" className="stroke">About us</MenuItems>
          <MenuItems to="/signup" isLast>
          
            <Button
              size="sm"
              rounded="md"
              className="btn-one"
              bg={buttonBg} // Apply background color based on color mode
              color={buttonTextColor} // Apply text color based on color mode
            >
              <span>Create Account</span> {/* Wrap the text in a span for hover effect */}
            </Button>
          </MenuItems>
        </Flex>
      </Box>
    </Flex>
  );
};

export default WelcomeHeader;
