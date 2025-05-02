import { useEffect, useRef} from "react";
import {
  Avatar,
  Flex,
  Text,
  useColorMode,
  Image,
  Box,
  Link,
} from "@chakra-ui/react";

const Message = ({ messages, user, selectedUser, onSendLocation, selectedUserProfilePicture }) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => {
      elementRef.current.scrollIntoView();
    }, [messages]);
    return <div ref={elementRef} />;
  };

  const { colorMode } = useColorMode();
  
  

  return (
    <Flex
      w="100%"
      h="80%"
      overflowY="scroll"
      flexDirection="column"
      p="3"
      className={colorMode === "dark" ? "dark-scrollbar" : "light-scrollbar"}
    >
      {messages.map((item, index) => {
        const isCurrentUser = item.from === user._id;

        // Log the sender and receiver for each message
        console.log(`Sender: ${item.from}, Receiver: ${isCurrentUser ? selectedUser._id : user._id}`);

        return (
          <Flex key={index} w="100%" justify={isCurrentUser ? "flex-end" : "flex-start"}>
            {!isCurrentUser && (
              <Avatar
                size="sm"
                name={selectedUser?.username}
                src={selectedUserProfilePicture}
                bg={!selectedUserProfilePicture ? "gray.500" : "transparent"}
                color={!selectedUserProfilePicture ? "white" : "inherit"}
                mr="2"
              />
            )}
            <Flex
              className={
                colorMode === "dark"
                  ? isCurrentUser
                    ? "dark-bubble-current-user"
                    : "dark-bubble"
                  : isCurrentUser
                  ? "light-bubble-current-user"
                  : "light-bubble"
              }
              minW="100px"
              maxW="350px"
              my="1"
              p="3"
              borderRadius="md"
            >
              {item.image ? (
                <Box borderRadius="md" p={1}  boxShadow="md">
                  <Image className="sent-image" src={item.image} alt="Sent Image" maxH="200px" borderRadius="md" />
                </Box>
              ) : item.file ? (
                <Box borderRadius="md" p={1} boxShadow="md">
                  <Link href={item.file} download isExternal>
                    <Text color="blue.500" textDecoration="underline">Download File</Text>
                  </Link>
                </Box>
              ) : item.location ? (
                <Box borderRadius="md" p={1} boxShadow="md">
                  <Link
                    href={`https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`}
                    isExternal
                  >
                    <Text color="blue.500" textDecoration="underline">📍 Location</Text>
                  </Link>
                </Box>
              ) : (
                <Text>{item.text}</Text>
              )}
            </Flex>
          </Flex>
        );
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Message;

