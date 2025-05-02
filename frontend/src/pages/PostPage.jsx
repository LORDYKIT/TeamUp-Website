import { Avatar, Box, Button, Divider, Flex, Image, Input, Text, IconButton,
Skeleton, SkeletonCircle
 } from "@chakra-ui/react";
import { DeleteIcon} from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Comment from "../components/Comment";
import { usePosts } from "../context/PostContext";
import { useUser } from '../context/UserContext'; // Import UserContext
import { useToast } from "@chakra-ui/react";
import axios from 'axios';


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


const PostPage = () => {
    const { _id} = useParams();
    const {deletePost, updatePosts } = usePosts(); 
    const { user: currentUser } = useUser(); 
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replies, setReplies] = useState(0);  
    const [commentsData, setCommentsData] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); 


  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts'); // Adjust the endpoint to match your API
      const data = await response.json();
      setPosts(data); // Set posts from the database
    } catch (error) {
      console.error("Error fetching posts:", error);
    
    }  
  };

      useEffect(() => {
        fetchPosts();
      }, []);
    
    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
            // console.log('Comments:', response.data);
            // const data = await response.json();
            setComments(response.data.reverse());
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0) {
        setPost(posts.find(p => p._id === _id));
        if (post) {
            setPosts(post);
            setLikeCount(post.likes);
            setLiked(post.likedBy?.includes(currentUser._id));
       
            setIsLoading(false); // Set loading to false when data is fetched
        
        } else {
            console.warn("Post not found with ID:", _id);
        }
    }
}, [posts, _id, currentUser._id]);


    useEffect(() => {
        const fetchPostLikes = async () => {
            if (_id) {
                try {
                    const response = await fetch(`http://localhost:5000/api/posts/${_id}`);
                    const postData = await response.json();
                    setLikeCount(postData.likes);
                    setReplies(postData.replies) // Update likeCount with the latest value from API
                    setLiked(postData.likedBy?.includes(currentUser._id)); // Check if the current user has liked the post
                } catch (error) {
                    console.error("Error fetching post data:", error);
                }
            }
        };

        fetchPostLikes();
        fetchComments(_id);
    }, [_id, currentUser._id]); // Re-fetch if _id or currentUser changes


    // Function to add a comment
  const addComment = async (postId, user_id, username, content, profilePicture) => {
    try {
        // setIsLoading(true);
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        user_id,
        username,
        content, 
        profilePicture,

      });
      console.log('Comment added:', response.data);
        // Insert the new comment at the beginning of the comments array
        setComments(prevComments => [response.data, ...prevComments]);
        setNewComment(""); // Clear the input field

         // Update the replies count in the post data if needed
         setReplies(prevReplies => prevReplies + 1);

    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
        // setIsLoading(false);
    }
  };

      // Function to delete a comment
const deleteComment = async (postId, commentId) => {
    try {
        // setIsLoading(true);
        const response = await axios.delete(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`);
        console.log('Comment deleted:', response.data);

        // Update the comments state to reflect the deletion
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));

        // Decrement replies count in the UI
        setReplies(prevReplies => prevReplies - 1);

        toast({
            title: "Comment deleted",
            description: "The comment has been successfully deleted.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        toast({
            title: "Error",
            description: "There was an error deleting the comment.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    } finally {
        // setIsLoading(false);
    }
};

const handleCommentLike = async (commentId) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/posts/${commentId}/like`, {
            userId: currentUser._id,
            postId: post._id,
        });
        const { likeCount, isLiked } = response.data;

        // Update the comment's like count and liked status in the comments state
        setComments(prevComments =>
            prevComments.map(comment =>
                comment._id === commentId ? { ...comment, likeCount, isLiked } : comment
            )

        );
    } catch (error) {
        console.error("Error liking/unliking comment:", error);
    }
};

    const checkCommentForHateSpeech = async (commentText) => {
        try {
          const response = await fetch("http://localhost:5000/api/check-comment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: commentText }),
          });
          const data = await response.json();
          return data.prediction === "Hateful";
        } catch (error) {
          console.error("Error checking comment:", error);
          return false;  // Default to non-hateful if there's an error
        }
      };

  

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const isHateful = await checkCommentForHateSpeech(newComment);
    if (isHateful) {
        toast({
            title: "Hateful comment detected.",
            description: "Your comment cannot be posted as it contains hateful content.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        return;
    }

    try {
        await addComment(post._id, currentUser._id, currentUser.username, newComment, currentUser.profilePicture);
        // Refetch comments to update state or directly setComments if new comment data is returned
        fetchComments(post._id);
    } catch (error) {
        console.error("Error adding comment:", error);
    }
};


const handleDeletePost = async () => {
    if (!post) return;

    try {
        // Sending a DELETE request to the API to delete the post
        const response = await axios.delete(`http://localhost:5000/api/posts/delete/${post._id}`);

        if (response.status === 200) {
            // Post was successfully deleted, redirect to the user's profile or homepage
            toast({
                title: "Post deleted",
                description: "The post has been successfully deleted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate(`/user/${currentUser._id}`); // Navigate back to the user’s profile
        } else {
            toast({
                title: "Error deleting post",
                description: "There was an error deleting the post. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        toast({
            title: "Error deleting post",
            description: "An error occurred while deleting the post. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};

    useEffect(() => {
        if (post && post.user_id) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/users/${post.user_id}`);
                    const data = await response.json();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    // setIsLoading(false);
                }
            };
    
            fetchUserData();
        }
    }, [post]);
    
 
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
    
        // Get the hours and minutes in 12-hour format with AM/PM
        const hours = date.getHours() % 12 || 12;  // Convert 24-hour to 12-hour format
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two-digit minutes
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';  // Determine AM or PM
    
        // Format the time with hours, minutes, and AM/PM
        const formattedTime = `${hours}:${minutes} ${ampm}`;
    
        return `${date.toLocaleDateString()} ${formattedTime}`;
    };

    const handleCopyComment = () => {
        navigator.clipboard.writeText(commentsData.content);
        toast({
            title: "Comment copied",
            description: "The comment content has been copied to your clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };
    
    if (isLoading) {
        return (
            <Box p={5}>
                 <SkeletonCircle size="10" mt={2} />
                <Skeleton height="15px" width="60%" mt={2} />
                <Skeleton height="20px" width="30%" mt={2} />
                <Skeleton height="200px" />
               
            </Box>
        );
    }
    return (
        <>
      
            {/* Post Header */}
            <Flex justifyContent="space-between">
    
                <Flex w={"full"} alignItems={"center"} gap={3}>
                    <Link to={`/user/${post?.user_id}`}>
                        <Avatar src={`http://localhost:5000${user?.profilePicture}`} size={"md"} name={user?.username} />
                    </Link>
                    <Flex>
                        <Text fontSize="lg" fontWeight="bold">
                            {user?.username}
                        </Text>
                        <Text fontSize="sm" color={categoryColors[post?.category] || categoryColors['No Category Specified']} ml={2}>
                        {post?.category}
                        </Text>
                       
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"sm"} width={36} textAlign={"right"} color={"gray.light"}>
                        {formatDate(post?.date)}
                    </Text>

                    {currentUser?.username === post?.username && (
                        <IconButton
                            icon={<DeleteIcon />}
                            onClick={handleDeletePost}
                            aria-label="Delete Post"
                            colorScheme="red"
                            variant="ghost"
                        />
                    )}
                </Flex>
            </Flex>

            {/* Post Content */}
            <Text my={3}>{post?.content}</Text>
            
            <Box overflow={"hidden"} >

                  {post?.picture && (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                        <Image 
                    src={`http://localhost:5000${post?.picture}`} 
                    w={"full"} 
                    maxHeight="400px" // Adjust as needed
                    objectFit="contain" // Ensures the image is not zoomed in
                />
                    </Box>
                )}
                
            </Box>

            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize='md'>{likeCount} likes</Text>
                <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                <Text color={"gray.light"} fontSize='md'>{replies} replies</Text>
            </Flex>

            {/* Add Comment Section */}
            <Divider my={4} />
            <Flex gap={2} alignItems={"center"} mb={4}>
                <Avatar name= {currentUser.username} src={`http://localhost:5000${currentUser.profilePicture}`} size="sm" />
                <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()} // Call handleAddComment when Enter is pressed
                />
        <Button onClick={handleAddComment}>Post</Button>
      </Flex>

      <Box maxHeight="400px" overflowY="scroll" px={4} py={2}>
           {/* Render Comments get comment data */}
            {comments.map((commentData) => (
                <Comment
                    key={commentData._id}
                    content={commentData.content}
                    date={commentData.date}
                    likes={commentData.likes}
                    username={commentData.username}
                    userAvatar={commentData.profilePicture}
                    id={commentData._id}
                    post_id={post?._id}
                    user_id={commentData.user_id}
                    comments={comments}
                    setComments={setComments}
                    onDelete={() => deleteComment(post._id, commentData._id)}
                />
            ))}
</Box>
        </>
    );
};

export default PostPage;
