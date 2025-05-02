import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { useColorMode } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast, Textarea, Image, CloseButton, useDisclosure, Input } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useFollow } from "../context/FollowContext";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { useUser } from "../context/UserContext"; // Import UserContext
import usePreviewImg from "../hooks/usePreviewImg"; // Image Preview Hook
import { useState, useRef,useEffect } from "react";
import { Link as RouterLink } from "react-router-dom"; // Import Link for routing
import axios from "axios";

const UserHeader = ({ id, username, fullname, biography, profilePicture, postCount, activeTab, setActiveTab}) => {
    const toast = useToast();
    const { followersData, followingData,toggleFollow,  fetchData} = useFollow();
    const { user, setUser } = useUser(); // Use UserContext
    const currentUsername = user.username;
    const currentID = user._id;
  
    // Modal states
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isFollowersOpen, onOpen: onFollowersOpen, onClose: onFollowersClose } = useDisclosure();
    const { isOpen: isFollowingOpen, onOpen: onFollowingOpen, onClose: onFollowingClose } = useDisclosure();

    const [newUsername, setNewUsername] = useState(user.username || "");
    const [newFullName, setNewFullName] = useState(user.fullname || "");
    const [newBio, setNewBio] = useState(user.biography || "");
    const [newProfilePic, setNewProfilePic] = useState(user.profilePicture || "");
    const [searchFollowingTerm, setSearchFollowingTerm] = useState(""); // Search term for following
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollower, setIsFollower] = useState(false);
    const [followStatus, setFollowStatus] = useState({});
    const [isLoading, setIsLoading] = useState(null);
    
    const { imgUrl, setImgUrl } = usePreviewImg(); // Image preview state
    const imageRef = useRef(null); // Image file input reference

    const { colorMode, toggleColorMode } = useColorMode();

    console.log(user._id)

  useEffect(() => {
    fetchData();
    
}, [id]);


useEffect(() => {
  console.log("Followers Data:", followersData);
  console.log("Following Data:", followingData);
  console.log("follower count and following", followerCount, followingCount)
}, [followersData, followingData]);

const [followerCount, setFollowerCount] = useState(0);
const [followingCount, setFollowingCount] = useState(0);

// Define fetchData as a separate function so it can be called externally
const followCount = async () => {
  try {
     
      if (!id) return; // Ensure user is defined before proceeding

      const followCountResponse = await axios.get(`http://localhost:5000/api/users/${id}/follow-count`); // Fetch follow count


      // Set follow counts based on the response
      setFollowerCount(followCountResponse.data.followersCount);
      setFollowingCount(followCountResponse.data.followingCount);
  } catch (error) {
      console.error("Error fetching followers/following data:", error);
  }
};



useEffect(() => {
  
followCount();
}, [followersData, followingData]);


  const [imageName, setImageName] = useState(''); // New state for the image name

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImgUrl(reader.result);
            setNewProfilePic(URL.createObjectURL(file)); // This creates a preview
            setImageName(file); // Store the actual file object
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

      // Update `newProfilePic` whenever the user selects a new image
      useEffect(() => {
        setImgUrl(imgUrl)
    }, [imgUrl]);
    

    useEffect(() => {
      setNewUsername(user.username || "");
      setNewFullName(user.fullname || "");
      setNewBio(user.biography || "");
      setNewProfilePic(user.profilePicture || "");
      // setImgUrl(profilePicture || "");
  }, [user]);


  
  const handleFollowToggle = async (followerID) => {
    // Optimistic UI update
    setFollowStatus(prevStatus => ({
        ...prevStatus,
        [followerID]: !prevStatus[followerID], // Toggle follow status immediately
    }));

    try {
    
        // Call the backend to toggle the follow status
        await toggleFollow(currentID, followerID);
        
        fetchData();
        // Show a success toast
        toast({
            title: followStatus[followerID] ? "Unfollowed" : "Followed",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        console.error("Error toggling follow status:", error);

        // If there was an error, revert the optimistic update
        setFollowStatus(prevStatus => ({
            ...prevStatus,
            [followerID]: !prevStatus[followerID], // Revert toggle if error
        }));

        toast({
            title: "Error",
            description: "There was an issue with updating your follow status. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    } 
};


    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: "Success.",
                status: "success",
                description: "Profile link copied.",
                duration: 3000,
                isClosable: true,
            });
        });
    };

    const handleProfileClick = () => {
        onFollowersClose(); 
        onFollowingClose(); 
        
    };

    useEffect(() => {
        console.log('Updated user in context:', user); 
        
    }, [user]);


    console.log("newProfilePic:", newProfilePic);

    const handleUpdateProfile = async () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('username', newUsername || user.username);
      formData.append('fullname', newFullName || user.fullname);
      formData.append('biography', newBio || user.biography);
  
      // Append the image file only if a new image has been selected
      if (imageName) {
          formData.append('profilePicture', imageName); // Append the file object
      }
  
      try {
          const response = await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
  
          // Use the new profile picture if updated, otherwise, retain the old one
          const imgUrl = response.data.profilePicture || user.profilePicture;
          
          const updatedUser = {
            _id: response.data._id,
              username: response.data.username,
              fullname: response.data.fullname,
              biography: response.data.biography,
              profilePicture: imgUrl, // Ensure existing image persists
          };
  
          setUser(updatedUser);
          // setNewProfilePic(imgUrl); // Set the profile picture to the updated or existing URL
  
          toast({
              title: "Profile updated successfully.",
              status: "success",
              duration: 3000,
              isClosable: true,
          });
          onEditClose();
      } catch (error) {
          console.error("Error updating profile:", error);
          toast({
              title: "Error updating profile.",
              description: "There was an error updating your profile. Please try again.",
              status: "error",
              duration: 3000,
              isClosable: true,
          });
      } finally {
        setIsLoading(false);
      }
  };
  
  // Function to fetch the profile picture URL
const fetchProfilePicture = async () => {
  try {
  
      // Construct the full URL to the profile picture
      const profilePicUrl = `http://localhost:5000${profilePicture}`;
      
      setNewProfilePic(profilePicUrl); // Set the full URL to the profile picture
  } catch (error) {
      console.error("Error fetching profile picture:", error);
      toast({
          title: "Error fetching profile picture.",
          description: "Unable to retrieve profile picture. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
      });
  }
};


useEffect(() => {
 
  try {
  if (user.profilePicture) {
   
    fetchProfilePicture();
  } 
} catch (error){
console.log(error)
} 
}, [user.profilePicture, user.username, user.fullname, user.biography]); // React to changes in user data


const handleSearchFollowing = (event) => {
  setSearchFollowingTerm(event.target.value);
};


useEffect(() => {
  // Fetch follow status whenever the username or currentUsername changes
  const fetchFollowStatus = async (id) => {
 
      try {

          const response = await fetch(`http://localhost:5000/api/users/checkFollowStatus/${currentID}/${id}`);
          const data = await response.json();
          setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [id]: data.isFollowing,
          }));
      } catch (error) {
          console.error("Error fetching follow status:", error);
      } 
  };

  fetchFollowStatus(id); // Call on the current page username

  // If you are fetching the followers data or following data, do so as well
  if (followersData?.followers) {
      followersData.followers.forEach((follower) => fetchFollowStatus(follower._id));
  }
  if (followingData?.following) {
      followingData.following.forEach((following) => fetchFollowStatus(following._id));
  }

}, [id, currentID, followersData, followingData]);  // Dependency array now includes username and currentUsername

if (isLoading) {
  return (
    <Flex
      justify="center"
      align="center"
      height="70vh"
      direction="column"
    >
      <img
        src="/Ellipsis@1x-1.0s-200px-200px.gif"  // Replace with your GIF URL
        alt="Loading..."
        width="200px"  // You can adjust the size as needed
      />
    </Flex>
  );
}

    return (
        <VStack gap={1} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>{currentID === id ? user.username : username}</Text>
      
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{currentID === id ? user.fullname : fullname}</Text>
              <Text 
                fontSize={"xs"} 
                bg={(colorMode === "dark" ? "gray.800" : "gray")}
                color={(colorMode === "dark" ? "gray" : "white")}
                p={1} 
                borderRadius={"full"}
              >
                teamup.net
              </Text>
              {id !== currentID && (
                    <Button
                    size="sm"
                    color={followStatus[id] ? "black" : "white"}
                    bg={followStatus[id] ? "white" : "blue.400"}
                    onClick={() => handleFollowToggle(id)}
                    _hover={{
                      color: followStatus[id] ? "black" : "white",
                      opacity: ".8",
                    }}
                  >
                    {followStatus[id] ? "Unfollow" : "Follow"}
                  </Button>
              )}
            </Flex>
          </Box>
          <Box>
          <Avatar 
          name={currentID === id ? user.username : username}
          src={`http://localhost:5000${currentID === id ? user.profilePicture : profilePicture}`} 
          size={{ base: "md", md: "xl" }} 
      />

          </Box>
        </Flex>
      
        <Text mb={1}> {currentID === id ? user.biography : biography}</Text> {/* Reduced margin bottom */}
      
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{postCount} posts</Text>
            <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
            <Text color={"gray.light"} cursor="pointer" onClick={onFollowersOpen}>
              {followerCount} followers
            </Text>
            <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
            <Text color={"gray.light"} cursor="pointer" onClick={onFollowingOpen}>
              {followingCount} following
            </Text>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg="transparent" boxShadow="lg">
                    <MenuItem backdropFilter="blur(10px)" onClick={copyURL}>
                      Copy link
                    </MenuItem>
                    {id === currentID && (
                    <MenuItem backdropFilter="blur(10px)" onClick={onEditOpen}>
                      Edit Profile
                    </MenuItem>
                  )}
                </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>
      
       {/* Increased margin-top for spacing between followers and the tabs */}
<Flex w={"full"} justifyContent={"space-between"} mt={4}> 
  <Flex
    flex={1}
    borderBottom={activeTab === "posts" ? (colorMode === "light" ? " 1.5px solid black" : " 1.5px solid white") : (colorMode === "dark" ? "1.5px solid gray" : "1.5px solid gray")} // Change to black for active tab in light mode
    justifyContent={"center"}
    pb="3"
    cursor={"pointer"}
    onClick={() => setActiveTab("posts")}
  >
    <Text 
      fontWeight={"bold"} 
      color={activeTab === "posts" ? (colorMode === "dark" ? "white" : "black") : (colorMode === "light" ? "gray" : "gray.light")} // Adjust colors based on color mode
    >
      Posts
    </Text>
  </Flex>
  <Flex
    flex={1}
    borderBottom={activeTab === "replies" ? (colorMode === "light" ? " 1.5px solid black" : " 1.5px solid white") : (colorMode === "dark" ? "1.5px solid gray" : "1.5px solid gray")} // Change to black for active tab in light mode
    justifyContent={"center"}
    pb="3"
    cursor={"pointer"}
    onClick={() => setActiveTab("replies")}
  >
    <Text 
      fontWeight={"bold"} 
      color={activeTab === "replies" ? (colorMode === "dark" ? "white" : "black") : (colorMode === "light" ? "gray" : "gray.light")} // Adjust colors based on color mode
    >
      Replies
        </Text>
      </Flex>
    </Flex>

           {/* Edit Profile Modal */}
           <Modal isOpen={isEditOpen} onClose={onEditClose}>
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
                    <ModalHeader color="white">Edit Profile</ModalHeader>
                    <ModalCloseButton color="white"/>
                    <ModalBody>
                        <Input
                            placeholder="Username"
                            color="white"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            mb={4}
                        />
                        <Input
                            placeholder="Full Name"
                            color="white"
                            value={newFullName}
                            onChange={(e) => setNewFullName(e.target.value)}
                            mb={4}
                        />
                        <Textarea
                            placeholder="Bio"
                            color="white"
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            mb={4}
                        />
                        <Input
                            type="file"
                            hidden
                            ref={imageRef}
                            onChange={handleImageChange}
                        />
                        <Button onClick={() => imageRef.current.click()}>
                           Change Avatar
                        </Button>
                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt="Selected profile pic" />
                                <CloseButton
                                    onClick={() => setImgUrl("")}
                                    color="white"
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}

                        <Flex mt={2} position={"center"}>
                        <Button colorScheme="teal" onClick={handleUpdateProfile} mt={4}>
                            Update Profile
                        </Button>
                        </Flex>

                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal for Followers */}
            <Modal isOpen={isFollowersOpen} onClose={onFollowersClose}>
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
                    <ModalHeader color="white">Followers</ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody>
                        <Input
                            placeholder="Search followers"
                            color="white" // This sets the text color
                            _placeholder={{ color: "whiteAlpha.700" }} // This sets the placeholder color
                            value={searchFollowingTerm}
                            onChange={handleSearchFollowing}
                            mb={4}
                        />
                        {(Array.isArray(followersData?.followers) ? followersData.followers : []).map((follower) => {
                            // Check if the follower's username includes the search term
                            if (follower.username !== username && follower.username.toLowerCase().includes(searchFollowingTerm.toLowerCase())) {
                                return (
                                    <Flex key={follower._id} alignItems="center" justifyContent="space-between" mb={4}>
                                        <Flex gap={2} alignItems="center">
                                            <Link as={RouterLink} to={`/user/${follower._id}`}>
                                                <Avatar name={follower.username} src={`http://localhost:5000${follower.profilePicture}`} size="sm" />
                                            </Link>
                                            <Text color="white">{follower.username}</Text>
                                        </Flex>
                                        {/* Conditionally render the button */}
                                    {follower._id !== currentID && (
                                        <Button
                                             size="sm"
                                             color={followStatus[follower._id] ?  "black" : "white"}
                                             bg={followStatus[follower._id] ?  "white" : "blue.400"}
                                             onClick={() => handleFollowToggle(follower._id)}
                                             _hover={{
                                               color: isFollowing ? "black" : "white",
                                               opacity: ".8",
                                             }}
                                         >
                                              {followStatus[follower._id] ? "Unfollow" : "Follow"}
                                         </Button>
                                        
                                      )
                                    }

                                    </Flex>
                                );
                            }
                            return null; // Do not render anything if it doesn't match
                        })}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal for Following (similar logic as above) */}
            <Modal isOpen={isFollowingOpen} onClose={onFollowingClose}>
                <ModalOverlay
                    bg="blackAlpha.600"
                    backdropFilter="blur(10px)"
                />
                <ModalContent
                    bg="transparent"
                    boxShadow="lg"
                    maxW="600px"
                    mt="80px"
                >
                    <ModalHeader color="white">Following</ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody>
                        <Input
                            placeholder="Search following"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.700" }}
                            value={searchFollowingTerm}
                            onChange={handleSearchFollowing}
                            mb={4}
                        />
                        {(Array.isArray(followingData?.following) ? followingData.following : []).map((following) => {
                            // Check if the following's username includes the search term
                            if (following.username !== username && following.username.toLowerCase().includes(searchFollowingTerm.toLowerCase())) {
                                return (
                                    <Flex key={following._id} alignItems="center" justifyContent="space-between" mb={4}>
                                        <Flex gap={2} alignItems="center">
                                            <Link as={RouterLink} to={`/user/${following._id}`}>
                                                <Avatar name={following.username} src={`http://localhost:5000${following.profilePicture}`} size="sm" />
                                            </Link>
                                            <Text color="white">{following.username}</Text>
                                        </Flex>
                                         {/* Conditionally render the button */}
                                          {following._id !== currentID && (
                                             <Button
                                             size="sm"
                                             color={followStatus[following._id] ? "black" : "white"}
                                             bg={followStatus[following._id] ? "white" : "blue.400"}
                                             onClick={() => handleFollowToggle(following._id)}
                                             _hover={{
                                               color: isFollowing ? "black" : "white",
                                               opacity: ".8",
                                             }}
                                         >
                                              {followStatus[following._id] ? "Unfollow" : "Follow"}
                                         </Button>
                                          )}
                                    </Flex>
                                );
                            }
                            return null; // Do not render anything if it doesn't match
                        })}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default UserHeader;
