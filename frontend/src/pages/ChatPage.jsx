
import { Box, Flex, Input, Text, useColorModeValue, Image, useColorMode} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useUser } from "../context/UserContext";
import Conversation from "../components/Conversation";
import ChatHeader from "../components/ChatHeader";
import ChatFooter from "../components/ChatFooter";
import Message from "../components/Message";
import { useNavigate } from 'react-router-dom'; 

const ChatPage = () => {
  const { users, user } = useUser(); 
  const { user: currentUser} = useUser(); // Keep the logged-in user unchanged
  const [searchText, setSearchText] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState(null); // State for the selected chat user
  const [allMessages, setAllMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const isSwitched = useRef(false); // Track if the user has switched chat
  const previousUserRef = useRef(selectedChatUser); // Track previous user
  const navigate = useNavigate();

  const { colorMode } = useColorMode();
  // Helper function to create a unique key for the chat based on the usernames
  const getChatKey = (user1, user2) => {
    return [user1._id, user2._id].sort().join("_");
  };

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setAllMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever allMessages state changes
  useEffect(() => {
    if (Object.keys(allMessages).length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(allMessages));
    }
  }, [allMessages]);

  const handleUserSelect = (selectedUser) => {
    setSelectedChatUser(selectedUser); // Update selected chat user

    const chatKey = getChatKey(user, selectedUser);

    // Set isSwitched to true when the user switches to a different chat user
    isSwitched.current = previousUserRef.current && previousUserRef.current._id !== selectedUser._id;
    previousUserRef.current = selectedUser; // Update the previous user reference

    // Check if there are messages for the selected user, initialize if not
    if (!allMessages[chatKey]) {
      setAllMessages((prevMessages) => ({
        ...prevMessages,
        [chatKey]: [
          { from: "computer", text: `Hi ${user.username}, I'm ${selectedUser.username}`, isSwitched: false },
        ],
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageBase64 = reader.result;
        const chatKey = getChatKey(user, selectedChatUser);

        setAllMessages((prevMessages) => ({
          ...prevMessages,
          [chatKey]: [
            ...(prevMessages[chatKey] || []),
            { from: user._id, text: "", image: imageBase64, isSwitched: isSwitched.current },
          ],
        }));
      };
      reader.readAsDataURL(file); // Convert the file to base64 for preview
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim().length || !selectedChatUser) {
      return;
    }

    const data = inputMessage;
    const chatKey = getChatKey(user, selectedChatUser);

    // Add the new message with isSwitched flag based on the user's switch state
    setAllMessages((prevMessages) => ({
      ...prevMessages,
      [chatKey]: [
        ...(prevMessages[chatKey] || []),
        { from: user._id, text: data, isSwitched: isSwitched.current }, // Set the correct sender
      ],
    }));
    setInputMessage("");
  };

  // Get messages for the currently selected chat user
  const currentMessages = selectedChatUser
    ? allMessages[getChatKey(user, selectedChatUser)] || []
    : [];

    const sendMessage = (newMessage) => {
      const chatKey = getChatKey(user, selectedChatUser);
      setAllMessages((prevMessages) => ({
        ...prevMessages,
        [chatKey]: [...(prevMessages[chatKey] || []), newMessage],
      }));
    };

    
  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
  
        const locationMessage = {
          from: user._id,
          location: { lat: latitude, lng: longitude },
          text: `Location shared: https://www.google.com/maps?q=${latitude},${longitude}` // Optional: add a text link
        };
  
        sendMessage(locationMessage);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  

  return (  
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
<Flex justify="space-between" align="center" mb={1}>
      {/* Left arrow button to navigate to homepage */}
      <Box className="icon-container-alt">
      <ArrowBackIcon 
             fontSize="2xl"
              aria-label="Back to homepage"
              onClick={() => navigate("/homepage")} // Navigate to homepage
            />
            </Box>
            </Flex>
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{ sm: "400px", md: "full" }}
        mx={"auto"}
      >
        {/* Users and Search Section */}
        <Flex
          flex={35}
          gap={2}
          flexDirection={"column"}
          maxW={{ base: "100%", md: "250px" }}
          mx={{ base: "auto", md: "0" }}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Users
          </Text>
          <Input
            placeholder="Search for a user"
            onChange={(e) => setSearchText(e.target.value)}
            width={{ base: "90%", md: "100%" }}
          />

          {/* Users list with scroll */}
          <Flex
            flexDirection="column"
            maxH="300px" // Set the max height for the scrollable area
            overflowY="scroll" // Enable vertical scrolling
            mt={2}
            className={colorMode === "dark" ? "dark-scrollbar" : "light-scrollbar"} 
          >
           {users
            .filter((u) => u.username.toLowerCase().includes(searchText.toLowerCase()) && u._id !== user._id) // Exclude the current user
            .map((u) => (
              <Conversation key={u.id} user={u} onClick={() => handleUserSelect(u)} />
            ))}
          </Flex>
        </Flex>

        {/* Chat Area */}
        <Flex
          flex={70}
          borderRadius={"md"}
          p={2}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          position="relative"
          maxH={{ base: "400px", md: "600px" }} // Define a max height for the chat area
        
        >
          {!selectedChatUser ? (
           <Flex
           flex={35}
           gap={2}
           flexDirection={"column"}
           maxW={{ base: "100%", md: "250px" }}
           minW={{ base: "100%", md: "250px" }} // Set a fixed min width to avoid resizing
           mx={{ base: "auto", md: "0" }}
         >
         
              <Image
                src="/output-onlinegiftools (2).gif"
                boxSize="150px"
                position="absolute" // Make the position absolute for better control
                top="90px" // Adjust the top position to move it higher
                zIndex={1}
              />
          
            <Text
            fontSize={19}
            fontWeight={"bold"} 
            position="relative"
            bottom="-230px"
            left="-23px"
            zIndex={2}
            textAlign="center"
            width="100%"
            whiteSpace="nowrap"
            color="gray.600"
          >
        
              Select a user to start chatting
            </Text>

             
            </Flex>
          ) : (
            <Flex
              w="100%"
              flexDir="column"
              overflowY="auto" // Enable scrolling within the message area
              maxH={{ base: "400px", md: "550px" }} // Set max height for the message area
            >
              <ChatHeader user={selectedChatUser} />
              <Message
                messages={currentMessages}
                user={user}
                selectedUser={selectedChatUser}
                selectedUserProfilePicture={`http://localhost:5000${selectedChatUser.profilePicture}`}
              />
              
              <ChatFooter
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                handleFileUpload={handleFileUpload}
                sendLocation={sendLocation}
              />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatPage;
