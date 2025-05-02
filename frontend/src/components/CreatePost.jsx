import { CloseButton, useToast, Flex, Select, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, Button } from "@chakra-ui/react"; 
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; 
import { useUser } from '../context/UserContext'; // Import UserContext
import axios from "axios";

const MAX_CHAR = 500;

const categories = [
  'Urgent', 'War Related', 'Medical Assistance', 'Volunteers Needed', 'Housing & Shelter',
  'Supplies Needed', 'Resource Donations', 'Discussion', 'No Category Specified'
];

const CreatePost = ({ triggerButton }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [imgUrl, setImgUrl] = useState(""); // Preview URL state
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useUser(); // Get current user from UserContext
  const imageRef = useRef(null);
  const [category, setCategory] = useState('No Category Specified'); // State for category
  const toast = useToast();
  const navigate = useNavigate();

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      setPostText(inputText.slice(0, MAX_CHAR));
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", currentUser.username);
    formData.append("content", postText);
    formData.append("category", category);
    formData.append("picture", imageRef.current.files[0]); // Append the selected file to FormData

    try {
      const token = localStorage.getItem('auth-token');
      // Make the API call to create a post
      const response = await axios.post("http://localhost:5000/api/posts/create-post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Post created.",
        description: "Your post has been successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Navigate to the newly created post page
      navigate(`/username/post/${response.data._id}`);

      // Clear input fields and close the modal
      setPostText("");
      setImgUrl("");
      setCategory('No Category Specified'); // Reset category
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post.",
        description: "There was an error creating your post. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

	return (
		<>
			{triggerButton ? <div onClick={onOpen}>{triggerButton}</div> : null}

			<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay
				bg="blackAlpha.600" // Add background blur effect
				backdropFilter="blur(10px)" // CSS blur effect
			/>
				<ModalContent
				bg="transparent" // Fully transparent modal
				boxShadow="lg" // Add shadow to make it stand out
				maxW="600px" // Make the modal wider
				mt="80px" // Position it towards the top of the page
			>
					<ModalHeader color="white ">Create Post</ModalHeader>
					<ModalCloseButton color="white"/>
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder='Post content goes here..'
								onChange={handleTextChange}
								value={postText}
								color='white'
								_placeholder={{ opacity: 0.6, color: 'white' }} // Placeholder color adjusted for better contrast
								bg="rgba(255, 255, 255, 0.1)" // Semi-transparent background for input field
								borderColor="whiteAlpha.400"
							  

							/>
							<Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color="white">
								{remainingChar}/{MAX_CHAR}
							</Text>

              {/* Category Select */}
              <FormControl mt={4}>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  
                  bg="rgba(255, 255, 255, 0.1)"
                  borderColor="whiteAlpha.400"
                  _placeholder={{ opacity: 0.6, color: 'white' }}
                  width="200px"
                >
                  <option value="No Category Specified" disabled>Select a Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </FormControl>

						  <Flex mt={10} align="center">
              <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
              <BsFillImageFill
                style={{ marginLeft: "10px", cursor: "pointer", color: "white" }} // Adjusted margin for more space
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </Flex>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt='Selected img' />
								<CloseButton
									onClick={() => setImgUrl("")}
									color="white"
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='teal' mr={3} onClick={handleCreatePost} isLoading={loading}>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
