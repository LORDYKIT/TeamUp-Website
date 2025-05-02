// import React, { createContext, useContext, useState, useEffect } from 'react';

// const PostContext = createContext();

// export const PostProvider = ({ children }) => {
//   const [posts, setPosts] = useState(() => {
//     // Load posts from local storage or use default posts if none exist
//     const storedPosts = JSON.parse(localStorage.getItem('posts'));
//     return storedPosts || [
//       {
//         id: 1,
//         username: "Sky9x",
//         profile: "/Sky9x.png",
//         postImg: "/post1.png",
//         postTitle: "Let's talk about love",
//         likes: 2350,
//         replies: 585,
//         createdAt: Date.now(),
//       },
//       {
//         id: 2,
//         username: "JaneDoe",
//         profile: "/jane-avatar.png",
//         postImg: "/post2.png",
//         postTitle: "Nice tutorial",
//         likes: 747,
//         replies: 367,
//         createdAt: Date.now(),
//       },
//       {
//         id: 3,
//         username: "elonmusk",
//         profile: "/elonmusk.png",
//         postImg: "/elonmusk.png",
//         postTitle: "I look good here",
//         likes: 2828,
//         replies: 689,
//         createdAt: Date.now(),
//       },
//     ];
//   });

//   useEffect(() => {
//     // Save posts to local storage whenever they change
//     localStorage.setItem('posts', JSON.stringify(posts));
//   }, [posts]);

//   const addPost = (newPost) => {
//     setPosts((prevPosts) => [newPost, ...prevPosts]); // Update state to include new post
//   };

//   const deletePost = (postId) => {
//     setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId)); // Remove post from state
//   };

//   const updatePosts = (newPosts) => {
//     setPosts(newPosts);
// };
//   return (
//     <PostContext.Provider value={{ posts, addPost, deletePost, updatePosts }}>
//       {children}
//     </PostContext.Provider>
//   );
// };

// export const usePosts = () => useContext(PostContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Context for Posts
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the database when the component mounts
  useEffect(() => {
  
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts'); // Adjust the endpoint to match your API
      const data = await response.json();
      setPosts(data); // Set posts from the database
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Add new post and send it to the backend to store in the database
  const addPost = async (newPost) => {
    try {
      const response = await fetch('http://localhost:5000/api/posts/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const savedPost = await response.json();
      setPosts((prevPosts) => [savedPost, ...prevPosts]); // Update local state with the newly added post
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };


  // Update posts in the state
  const updatePosts = (newPosts) => {
    setPosts(newPosts);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePosts, fetchPosts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
