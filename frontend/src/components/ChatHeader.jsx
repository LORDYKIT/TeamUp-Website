
// ChatHeader.jsx
import { useEffect, useState } from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

const ChatHeader = ({ user }) => {
  const [avatarSrc, setAvatarSrc] = useState(user?.profilePic || user?.avatar);

  useEffect(() => {
    // Update the avatar source when the user changes
    if (user?.profilePic) {
      setAvatarSrc(user.profilePic);
    } else {
      setAvatarSrc(user.avatar);
    }
  }, [user]);

  const toggleAvatarSrc = () => {
    // Toggle between profilePic and avatar
    if (user?.profilePic) {
      setAvatarSrc((prevSrc) => (prevSrc === user.profilePic ? user.avatar : user.profilePic));
    }
  };

  return (
    <Flex w="100%" align="center" p="3" onClick={toggleAvatarSrc}>
      <Avatar
        key={user?.id || "default"} // Adding a unique key to force re-render
        size="md"
        name={user?.username}
        src={`http://localhost:5000${user.profilePicture}`} 
      >
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          {user?.username}
        </Text>
        <Text color="green.500">Online</Text>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
