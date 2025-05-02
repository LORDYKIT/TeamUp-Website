
// Conversation.jsx
import { Avatar, Flex, Text } from "@chakra-ui/react";

const Conversation = ({ user, onClick }) => {
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: "gray.600",
        color: "white",
      }}
      onClick={onClick}
      borderRadius={"md"}
    >
      <Avatar 
        name={user.username} 
        src={`http://localhost:5000${user.profilePicture}`} // Use 'undefined' if 'profilePic' is not available
        size={"sm"} 
      />
      <Text fontWeight="700">{user.username}</Text>
    </Flex>
  );
};

export default Conversation;
