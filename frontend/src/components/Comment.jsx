import { Avatar, Divider, Flex, Text, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import ActionsComment from "./ActionsComment";
import { useUser } from '../context/UserContext'; // Import UserContext
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const Comment = ({ date, username, content, id, onDelete, userAvatar, user_id, post_id, comments, activeTab, likes}) => {
    const { user: currentUser } = useUser();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes || 0);
    const [postid, setPostId] = useState(0); // Get current user from UserContext

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
    

    const formattedCreatedAt = formatDate(date);

    useEffect(() => {
        const fetchLikedComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${currentUser._id}/liked-comments`);
                const likedComments = response.data.likedComments;
                if (likedComments.some(comment => comment._id === id)) {
                    setLiked(true);
                    
                }
            } catch (error) {
                console.error("Error fetching liked comments:", error);
            }
        };

        const fetchPostIdFromComment = async (commentId) => {
            try {
              const response = await axios.get(`http://localhost:5000/api/posts/post/${commentId}`);
              if (response.data.postId) {
                console.log('Post ID:', response.data.postId);
                setPostId(response.data.postId);
                // You can now pass the post ID to your Comments component or use it as needed
              } else {
                console.error('No post found for this comment');
              }
            } catch (error) {
              console.error('Error fetching post ID:', error);
            }
          };

        fetchLikedComments();
        if (id) {
            fetchPostIdFromComment(id);
          }
          
    }, [id, currentUser]);

       
    const navigate = useNavigate();

    const handleNavigateToPost = () => {
        if (postid) {
          navigate(`/${user_id}/post/${postid}`);
        } else {
          console.error("Post ID not available");
        }
      };
      
    
    const handleCommentLike = async (commentid, likedstatus) => {
        setLiked(likedstatus);

        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${commentid}/like`, {
                userId: currentUser._id,
                postId: postid,
                liked: likedstatus,
            });
            setLikeCount(response.data.likeCount);
        } catch (error) {
            console.error("Error liking/unliking comment:", error);
            setLiked(!likedstatus); // Revert if error
        }
    };

 console.log("comment id",id)
 console.log("post id",post_id)
 console.log("user id", currentUser._id)

    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"} >
                <Link to={`/user/${user_id}`}>
                    <Avatar name={username} src={`http://localhost:5000${currentUser._id === user_id ? currentUser.profilePicture : userAvatar}`} size={"sm"} />
                </Link>
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        
                        <Flex alignItems={"center"}>
                           
                            <Text fontSize="md" fontWeight="bold">{currentUser._id === user_id ? currentUser.username : username}</Text>
                            
                        
                        </Flex>
                        
                        <Flex onClick={handleNavigateToPost} gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>
                                {formattedCreatedAt}
                            </Text>
                          
                           
                            {username === currentUser.username && (
                                <Menu>
                                    <MenuButton>
                                        <BsThreeDots />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => onDelete(id)}>Delete</MenuItem>
                                    </MenuList>
                                </Menu>


                            )}

                <Flex justifyContent="flex-end"  mt={1}>
                    <ActionsComment
                        liked={liked}
                        onLikeToggle={handleCommentLike}
                        activeTab={activeTab}
                        commentid={id}
                        
                    />
                </Flex>
                        </Flex>
                       
                    </Flex>
                    <Text onClick={handleNavigateToPost} >{content}  </Text>
                    <Text fontSize={"sm"} color={"gray.light"}>
                            {likeCount} likes
                        </Text>
                   
                       
                    </Flex>
                    
            </Flex>
            <Divider />
        </>
    );
};

export default Comment;
