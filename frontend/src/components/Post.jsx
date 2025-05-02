import {
  Box, Flex, Avatar, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, Input, Image, WrapItem, Wrap, 
} from "@chakra-ui/react"; // Import Modal components
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing
import { SettingsIcon, ChatIcon, AddIcon, SearchIcon } from "@chakra-ui/icons"; // Import icons
import { usePosts } from "../context/PostContext"; // Import usePosts
import { useEffect, useState } from "react"; // Import useState for modal state
import { useRecoilState } from "recoil"; // Import Recoil state management
import userAtom from "../atoms/userAtom"; // Import user atom
import { useUser } from '../context/UserContext'; // Import UserContext
import UserPost from "./UserPost";
import { Text } from "@chakra-ui/layout";
import SuggestedUsers from "../components/SuggestedUsers";
import CreatePost from "./CreatePost";
import axios from "axios";
import { Skeleton, SkeletonText, SkeletonCircle } from "@chakra-ui/react";


const Post = () => {
  const [liked, setLiked] = useState(false); // Get posts and deletePost from context
  const [isLogoutOpen, setLogoutOpen] = useState(false); // State for logout modal
  const [isSearchOpen, setSearchOpen] = useState(false); // State for search modal
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [filteredPosts, setFilteredPosts] = useState([]); // State for filtered posts
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [user, setUser] = useRecoilState(userAtom); // Use Recoil state for user
  const navigate = useNavigate(); // Initialize useNavigate
  const { user: currentUser, users } = useUser(); // Get current user from UserContext
  const { posts, fetchPosts, addPost } = usePosts();
  console.log("Current User:", currentUser);
  console.log("All Users:", users);
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility



  useEffect(() => {
    // Check if the user is signed in (defaultUser means no user)
    if (currentUser?.username === "defaultUser") {
      setModalOpen(true); // Show modal if user is not signed in
    } else {
      setModalOpen(false); // Hide modal if user is signed in
    }
  }, [currentUser]);


  useEffect(() => {
    const refreshPosts = async () => {
      try{
     await fetchPosts(); // Fetch latest posts data
      }catch(error){
        console.log(error)
      }
    };
     refreshPosts();
    
   }, []); 

  useEffect(() => {
 
    const fetchUserData = async () => {
    
      try {
        const response = await fetch(`http://localhost:5000/api/users/${currentUser._id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } 
    };
  const fetchUserPosts = async () => {
  
    try {
      const response = await axios.get(`http://localhost:5000/api/posts`);
      const sortedPosts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUserPosts(sortedPosts); // Update user posts
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
   
  };

  fetchUserPosts();
  fetchUserData();
}, [ location]); 


  // Function to handle logout
  const handleLogout = () => {
    
    setLogoutOpen(false); // Close the modal
    navigate("/"); // Navigate to the welcome page
  };

  useEffect(() => {
    const refreshPosts = async () => {
      await fetchPosts();
    };
    refreshPosts();
  }, [searchInput]); // Refresh data on search input change

  useEffect(() => {
    const filterContent = () => {
      const categoryFilteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

      const searchFilteredPosts = categoryFilteredPosts.filter(post =>
        post.content?.toLowerCase().includes(searchInput) ||
        post.username?.toLowerCase().includes(searchInput)
      );

      const searchFilteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchInput)
      );

      setFilteredPosts(searchFilteredPosts);
      setFilteredUsers(searchFilteredUsers);
    };
    filterContent();
  }, [searchInput, selectedCategory, posts, users]);



  const handleSearchInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchInput(input);
  };

  
  const handleSignIn = () => {
    navigate("/login"); // Navigate to login page when the sign-in button is clicked
    setModalOpen(false); // Close the modal
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} gap="10" alignItems="flex-start" position="relative">
       {/* Sign In Modal */}
       <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent bg="transparent" boxShadow="lg" maxW="600px" mt="80px">
          <ModalHeader color="white">You are not signed in</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="white">Please sign in to continue.</Text>
            <Flex justifyContent="center" mt={4}>
              <Button colorScheme="teal" onClick={handleSignIn}>Sign In</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Icons at the top-left of the screen */}
      <Flex position="absolute" top="-10px" left="20px" gap="4px">
      <Box className="icon-container-alt">
        <Link to="#" onClick={() => setLogoutOpen(true)}> {/* Open logout modal */}
          <SettingsIcon boxSize={6} />
        </Link>
        </Box>
        <Box className="icon-container-alt">
        <Link to="/chat">
          <ChatIcon boxSize={6} />
        </Link>
        </Box>
        {/* Search icon */}
        <Box className="icon-container-alt">
        <SearchIcon
          boxSize={6}
          aria-label="Search"
          onClick={() => setSearchOpen(true)} // Open search modal
          variant="ghost"
        />
        </Box>
      </Flex>

      <Flex position="absolute" top="-16px" right="20px" gap="6px">
      <Box className="icon-container-alt">
        <CreatePost triggerButton={<AddIcon boxSize={6} ></AddIcon>} />
        </Box>
        {currentUser && ( // Render Avatar only if currentUser is available
          <Flex position="relative" top="5px"> 
          <Link to={`/user/${currentUser._id}`}>
            <Avatar
              name={currentUser._id} 
              src={`http://localhost:5000${currentUser.profilePicture}`} // Adjusted to use dynamic username
              size={{ base: "sm", md: "sm" }}
              _hover={{ cursor: "pointer" }}
            />
          </Link>
          </Flex>
          
        )}
      </Flex>

      {/* Right side: Suggested Users */}
          <Flex
            direction="column"
            position="absolute"
            top="40px"
            right="20px"
            display={{ base: "none", md: "flex" }}
            zIndex={10}
            width="300px" // Set a fixed width to the suggested users section
          >
            <Box mt={5} w="full">
              <SuggestedUsers />
            </Box>
          </Flex>
     {/* Main content for posts */}
     <Flex flex={1} direction="column" gap="10px" position="relative" top="40px" left="20px" w="full">
  <Flex direction="column" position="relative" wrap="wrap" gap="10px" justify="flex-start" maxW="full">
    {userPosts.length === 0 ? (
      // Show loading skeletons while posts are loading
      Array.from({ length: 3 }).map((_, index) => (
        <Box key={index} w={{ base: "100%", md: "48%" }} mb="20px">
            
   
        <SkeletonCircle size="10" />
        <SkeletonText noOfLines={2} />
   
      <Skeleton height="200px" />
    
          
        </Box>
      ))
    ) : (
      // Render actual posts if `userPosts` is populated
      userPosts.map((post) => (
        <Box key={post._id} w={{ base: "100%", md: "48%" }} mb="20px">
          <UserPost
            id={currentUser._id}
            _id={post._id}
            user_id={post.user_id}
            username={post.username}
            picture={post.picture}
            profilePicture={user.profilePicture}
            content={post.content}
            category={post.category}
            likes={post.likes}
            replies={post.comments.length}
            date={post.date}
            comments={post.comments}
          />
        </Box>
      ))
    )}
  </Flex>
</Flex>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutOpen} onClose={() => setLogoutOpen(false)}>
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
          <ModalHeader color="white"> Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Text color="white">Do you want to log out? </Text>
            <Flex justifyContent="space-between" mt={4}>
              <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
              <Button colorScheme="teal" onClick={handleLogout}>Logout</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Search Modal */}
      <Modal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent bg="transparent" boxShadow="lg" maxW="600px" mt="80px">
          <ModalHeader color="white">Search</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <Input
             
              placeholder="Search users or posts..."
              _placeholder={{ opacity: 0.6, color: 'white' }}
              bg="rgba(255, 255, 255, 0.1)"
              borderColor="whiteAlpha.400"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
  {/* Scrollable Category Segmented Control */}
<Box mt={4} maxHeight="200px" overflowY="auto" width="100%">
  <Wrap spacing="4">
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('All')} 
        colorScheme={selectedCategory === 'All' ? 'teal' : 'gray'}
      >
        All
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('Urgent')} 
        colorScheme={selectedCategory === 'Urgent' ? 'red' : 'gray'}
      >
        Urgent
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('War Related')} 
        colorScheme={selectedCategory === 'War Related' ? 'yellow' : 'gray'}
      >
        War Related
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('Medical Assistance')} 
        colorScheme={selectedCategory === 'Medical Assistance' ? 'green' : 'gray'}
      >
        Medical Assistance
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('Volunteers Needed')} 
        colorScheme={selectedCategory === 'Volunteers Needed' ? 'blue' : 'gray'}
      >
        Volunteers Needed
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('Housing & Shelter')} 
        colorScheme={selectedCategory === 'Housing & Shelter' ? 'purple' : 'gray'}
      >
        Housing & Shelter
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('Supplies Needed')} 
        colorScheme={selectedCategory === 'Supplies Needed' ? 'cyan' : 'gray'}
      >
        Supplies Needed
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('Resource Donations')} 
        colorScheme={selectedCategory === 'Resource Donations' ? 'orange' : 'gray'}
      >
        Resource Donations
      </Button>
    </WrapItem>
    <WrapItem>
      <Button 
        onClick={() => setSelectedCategory('Discussion')} 
        colorScheme={selectedCategory === 'Discussion' ? 'blue' : 'gray'}
      >
        Discussion
      </Button>
    </WrapItem>
  </Wrap>
</Box>


            <Box mt={4} color="white" w="full">
              {filteredUsers.length === 0 && filteredPosts.length === 0 ? (
                <Flex direction="column" alignItems="center" justifyContent="center" h="100%">
                  <Image src="/Magnify@1x-2.4s-200px-200px.gif" alt="No results" boxSize="150px" />
                  <Text color="white" mt={2} fontWeight="bold">No results...</Text>
                </Flex>
              ) : (
                <>
                 {filteredPosts.length > 0 && (
                    <Box mt={4}>
                      {filteredPosts.map(post => (
                        <UserPost
                          key={post._id}
                          _id={post._id}
                          user_id={post.user_id}
                          username={post.username}
                          picture={post.picture}
                          content={post.content}
                          likes={post.likes}
                          category={post.category}
                          replies={post.comments.length}
                          date={post.date}
                          isSearch={true} // In search context, so no actions displayed
                        />
                      ))}
                    </Box>
                  )}
                  {filteredUsers.length > 0 && (
                    <Box display="flex" flexDirection="column" gap={2}>
                      {filteredUsers.map(user => (
                        <Flex key={user._id} alignItems="center" justifyContent="space-between" p={3} borderRadius="md">
                          <Link to={`/user/${user._id}`}>
                            <Flex alignItems="center" gap={3}>
                              <Avatar name={user.username} src={`http://localhost:5000${user.profilePicture}`} size="sm" />
                              <Text color="white" fontWeight="bold">{user.username}</Text>
                            </Flex>
                          </Link>
                        </Flex>
                      ))}
                    </Box>
                  )}
                 
                </>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Post;
