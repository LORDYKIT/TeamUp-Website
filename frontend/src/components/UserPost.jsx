import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState, useEffect } from "react";
import { useUser } from '../context/UserContext.jsx'; // Import UserContext
import { usePosts } from "../context/PostContext";
import axios from 'axios';
import { useLike } from "../context/LikeContext";
import { useLocation } from "react-router-dom";

// Category color mapping
const categoryColors = {
    'Urgent': '#FF4F4F',
    'War Related': '#FFB84D',
    'Medical Assistance': '#4CAF50',
    'Volunteers Needed': '#2196F3',
    'Housing & Shelter': '#9C27B0',
    'Supplies Needed': '#00BCD4',
    'Resource Donations': '#FF5722',
    'Discussion': '#607D8B',
    'No Category Specified': '#9E9E9E',
  };

  
  
const UserPost = ({ _id, id, user_id, content, username, picture, profilePicture, category, likes, replies, date, onDelete, isUserPage, isSearch }) => {
  const [liked, setLiked] = useState(false); // State to handle liked status for this post
  const [likedPosts, setLikedPosts] = useState(new Set()); 
    const { posts} = usePosts(); // Access posts and toggleLike from context
    const { user: currentUser } = useUser(); // Get current user from UserContext
    const [likeCount, setLikeCount] = useState(likes || 0);
    const{users, setUsers} = useUser();

    // Find the current post from posts context
    const post = posts.find(post => post._id === _id);
    const postAuthor = users.find(user => user._id === user_id);


  

      
    // Fetch the user's liked posts when the component mounts
    useEffect(() => {
      const fetchLikedPosts = async () => {
          try {
              const response = await axios.get(`http://localhost:5000/api/users/user-liked-posts/${currentUser._id}`);
              const likedPostIds = response.data;
              setLikedPosts(new Set(likedPostIds)); // Store liked posts as a Set for easy lookup
             
          } catch (error) {
              console.error('Error fetching liked posts:', error);
          }
      };

      fetchLikedPosts();
  }, [currentUser._id]);

  useEffect(() => {
    if (post && likedPosts.has(post._id)) {
      setLiked(true);
    }
  }, [post, likedPosts]);


const handleLike = async () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
  
    try {
        const response = await axios.post('http://localhost:5000/api/posts/like-post', {
            userId: currentUser._id,
            postId: _id,
            liked: newLikedStatus
        });
  
        // Ensure we update the like count from the backend response
        setLikeCount(response.data.likes);
  
        // Update the liked posts state
        setLikedPosts(prevLikedPosts => {
            const updatedLikedPosts = new Set(prevLikedPosts);
            if (newLikedStatus) {
                updatedLikedPosts.add(_id);
            } else {
                updatedLikedPosts.delete(_id);
            }
            return updatedLikedPosts;
        });
    } catch (error) {
        console.error('Error liking post:', error);
        setLiked(!newLikedStatus); // Revert like state if there's an error
    }
  };
  

      const formatDate = (timestamp) => {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - timestamp) / 1000);
        
        if (diffInSeconds < 60) {
          return `${diffInSeconds}s`;
        } else if (diffInSeconds < 3600) {
          return `${Math.floor(diffInSeconds / 60)}m`;
        } else if (diffInSeconds < 86400) {
          return `${Math.floor(diffInSeconds / 3600)}h`;
        } else {
          return new Date(timestamp).toLocaleDateString();
        }
      };
    
      const formattedCreatedAt = formatDate(date);
    
      const [topLikers, setTopLikers] = useState([]); // State for storing top 3 likers

useEffect(() => {
    if (likeCount >= 3) {
        const fetchTopLikers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/first-three-likers/${_id}`);
                setTopLikers(response.data); // Store likers data
            } catch (error) {
                console.error('Error fetching top likers:', error);
            }
        };

        fetchTopLikers();
    }
}, [likeCount, _id]);



    return (
        <Flex gap={3} mb={5} py={4} as={Link} to={`/${id}/post/${_id}`}>
            <Flex flexDirection={"column"} alignItems={"center"}>
            <Link to={`/user/${user_id}`}>
            <Avatar size='md' name={username} src={`http://localhost:5000${currentUser._id === user_id? currentUser?.profilePicture : postAuthor?.profilePicture}`} />
            </Link>
                    <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
                    {likeCount >= 3 && (
                    <Box position={"relative"} w={"full"}>
                        {topLikers.map((liker, index) => (
                            <Avatar
                                key={index}
                                size="xs"
                                src={`http://localhost:5000${liker.profilePicture}`}
                                position={"absolute"}
                                top={index === 1 ? "0px" : "10px"} // Adjust positions as needed
                                left={index * 10 + "px"} // Example to spread avatars horizontally
                            />
                            
                        ))}
                    </Box>
                )}
                </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize="md" fontWeight="bold">{currentUser._id === user_id? currentUser.username : username}</Text>
                        <Text fontSize="sm" color={categoryColors[category] || categoryColors['No Category Specified']} ml={2}>
                        {category}
                        </Text>
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontStyle={"sm"} color={"gray.light"}>{formattedCreatedAt}</Text>
                        <Flex alignItems={"center"} gap={2}>
                            <BsThreeDots />
                            {/* {username === currentUser.username && <DeleteIcon onClick={handleDelete} cursor="pointer" />} */}
                        </Flex>
                    </Flex>
                </Flex>

                <Text fontSize={"md"}>{content}</Text>
                {picture && (
                    
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}  maxW={isUserPage ? "500px" : "400px"}  >
                        <Image src={`http://localhost:5000${picture}`} w={"full"} />
                    </Box>
                )}
                
                {!isSearch && (
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={handleLike} postId={_id} content={content}/>
                </Flex>
            )}

                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize='sm'> {likeCount} likes</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                    <Text color={"gray.light"} fontSize='sm'>{replies} replies</Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default UserPost;