import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useFollow } from "../context/FollowContext";
import { useUser } from '../context/UserContext'; // Import UserContext
import { useState } from "react";
import { useToast} from "@chakra-ui/react";
import {useEffect } from "react";
const SuggestedUser = ({ id, username, profilePic, fullName }) => {
    const toast = useToast();
    const { user: currentUser } = useUser(); // Get current user from UserContext
    const { followersData, followingData, toggleFollow} = useFollow();
    const [followStatus, setFollowStatus] = useState({});
    const isFollowing = followingData[currentUser.username]?.includes(username);
    const followerCount = followersData[username]?.length || 0;
    
    const handleFollowToggle = async (followerID) => {
        // Optimistic UI update
        setFollowStatus(prevStatus => ({
            ...prevStatus,
            [followerID]: !prevStatus[followerID], // Toggle follow status immediately
        }));
    
        try {
            await toggleFollow(currentUser._id, id);
            
            
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
    
    useEffect(() => {
        // Fetch follow status whenever the username or currentUsername changes
        const fetchFollowStatus = async (id) => {
       
            try {
      
                const response = await fetch(`http://localhost:5000/api/users/checkFollowStatus/${currentUser._id}/${id}`);
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
      
      }, [id, currentUser._id, followersData, followingData]);  // Dependency array now includes username and currentUsername
      
    return (
        <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
            <Flex gap={2} as={Link} 
            to={`/user/${id}`}
            >
                <Avatar  name={username} src={`http://localhost:5000${profilePic}`}/>
                <Box>
                    <Text fontSize={"md"} fontWeight={"bold"}>{username}</Text>
                    <Text color={"gray.light"} fontSize={"sm"}>{fullName}</Text>
                </Box>
            </Flex>
            <Button
            size="sm"
            color={followStatus[id] ?  "black" : "white"}
            bg={followStatus[id] ?  "white" : "blue.400"}
            onClick={() => handleFollowToggle(id)}
            _hover={{
            color: isFollowing ? "black" : "white",
            opacity: ".8",
            }}
        >
            {followStatus[id] ? "Unfollow" : "Follow"}
        </Button>
        </Flex>
    );
};

export default SuggestedUser;
