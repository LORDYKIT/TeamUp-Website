
import { Flex, Input, Button, IconButton } from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs"; // Import image icon
import { useRef } from "react";
import { HiLocationMarker } from "react-icons/hi"; // Importing location pin icon
import { useColorModeValue } from "@chakra-ui/react";

const ChatFooter = ({ inputMessage, setInputMessage, handleSendMessage, handleFileUpload, sendLocation }) => {
	const fileInputRef = useRef(null);

	const triggerFileUpload = () => {
		fileInputRef.current.click(); // Open the file dialog when the icon is clicked
	  };

  return (
	
<Flex alignItems="center" p={3} w="100%">

		<IconButton
		aria-label="Send location"
		icon={<HiLocationMarker />}
		onClick={sendLocation}
		variant="ghost" // This removes the border and background
		ml={0}
		/>

		<IconButton
		aria-label="Upload Image"
		icon={<BsFillImageFill />}
		onClick={triggerFileUpload} // Handle file upload on icon click
		variant="ghost" // This removes the border and background
		mr={2}
		/>

      {/* Hidden file input */}
      <Input
        type="file"
        ref={fileInputRef}
        display="none" // Hide the input element
        accept="image/*" // Allow only image files
        onChange={handleFileUpload} // Trigger the upload handler on file select
      />

  	<Input
    	placeholder="Type Something..."
    	border="none"
    	borderRadius="full"
    	_focus={{
      	border: "1px solid black",
    	}}
    	onKeyPress={(e) => {
      	if (e.key === "Enter") {
        	handleSendMessage();
      	}
    	}}
    	value={inputMessage}
    	onChange={(e) => setInputMessage(e.target.value)}
  	/>
  	<Button
		bg={useColorModeValue("white", "gray.1000")} // White in light mode, gray.800 in dark mode
		color={useColorModeValue("black", "white")} // Black text in light mode, white text in dark mode
		borderRadius="full"
		_hover={{
			bg: useColorModeValue("#80B4AB", "gray.700"), // Different hover colors for light/dark mode
			color: useColorModeValue("black", "white"),
			border: "1px solid black",
		}}
		disabled={inputMessage.trim().length <= 0}
		onClick={handleSendMessage}
		>
		Send
		</Button>
	</Flex>
  );
};

export default ChatFooter;