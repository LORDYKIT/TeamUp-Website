import UserHeader from "../components/UserHeader";
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex, Box} from '@chakra-ui/react';
import UserPost from "../components/UserPost";
import { usePosts } from "../context/PostContext";
import { useParams } from "react-router-dom";
import { useState } from "react"; 
import Comment from "../components/Comment";
import { Text } from "@chakra-ui/layout";
import { useEffect } from "react";
import { FollowProvider } from '../context/FollowContext';
import { PostProvider } from "../context/PostContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

const UserPage = () => {
  const { _id } = useParams(); // Get the username from URL parameters
  const { posts } = usePosts(); // Access posts from the context
  const [activeTab, setActiveTab] = useState("posts"); // State to manage active tab
  const [userData, setUserData] = useState(null);
  // const {fetchPosts} = usePosts();
  const [userPosts, setUserPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data for the user based on the `username` parameter
    const fetchUserData = async () => {
      // setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/users/${_id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        // setIsLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      // setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${_id}/posts`);
        setUserPosts(response.data); // Update user posts
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
      finally{
        // setIsLoading(false);
      }
    };

    fetchUserPosts();
    fetchUserData();
  }, [_id, activeTab]); 
  
  
  // Reverse the posts order to display newest first
  const reversedPosts = [...userPosts].reverse();

  // Collect all comments from the user's posts and reverse their order (newest at the top)
  const userComments = reversedPosts.flatMap(post => 
    post.comments ? [...post.comments].reverse() : []
  );

  const postCount = reversedPosts.length;

   // Return loading message if userData is not yet fetched
  if (!userData ) {
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
    <>
    <PostProvider username={userData.username} id={_id}>
     <FollowProvider username={userData.username} id={_id}>
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
      {/* Pass activeTab and setActiveTab to UserHeader */}
      <UserHeader
       id={_id}
        key={userData.username}
        username={userData.username}
        fullname={userData.fullname}
        biography={userData.biography}
        profilePicture={userData.profilePicture}
        postCount={postCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Render content based on the active tab */}
      {activeTab === "posts" ? (
          reversedPosts.length > 0 ? (
            reversedPosts.map(post => (
              <UserPost
              id={_id}
                key={post._id}
                _id={post._id}
                user_id={post.user_id}
                username={post.username}
                picture={post.picture} 
                profilePicture={userData.profilePicture}// Assuming profile picture is fetched
                content={post.content} // Using content as postTitle
                category={post.category} // Image URL
                likes={post.likes}
                replies={post.comments.length} // Number of replies
                date={post.date}
                comments={post.comments}
                isUserPage={true}
              />
            ))
        ) : (
          <Text
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            color="gray.500"
            mt={10}
          >
            No posts found for this user.
          </Text>
        )
      ) : (
        userComments.length > 0 ? (
          userComments.map(commentData => (
            <Comment
            key={commentData._id}
            content={commentData.content}
            date={commentData.date}
            likes={commentData.likes}
            username={commentData.username}
            userAvatar={commentData.profilePicture}
            id={commentData._id}
            
            user_id={commentData.user_id}
            activeTab={activeTab}
            
            />
          ))
        ) : (
          <Text
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            color="gray.500"
            mt={10}
          >
            No replies found for this user.
          </Text>
        )
      )}
      </FollowProvider>
      </PostProvider>
    </>
  );
};

export default UserPage;
