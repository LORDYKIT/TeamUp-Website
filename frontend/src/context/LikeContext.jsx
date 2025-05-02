// LikeContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create context
const LikeContext = createContext();

// Context provider component
export const LikeProvider = ({ children }) => {
    const [likedPosts, setLikedPosts] = useState({});

    // Function to toggle like status
    const toggleLike = async (postId, userId, isLiked) => {
        const newLikeStatus = !isLiked;

        // Optimistic update
        setLikedPosts(prev => ({
            ...prev,
            [postId]: { liked: newLikeStatus, count: (prev[postId]?.count || 0) + (newLikeStatus ? 1 : -1) }
        }));

        try {
            // API request to like or unlike the post
            const response = await axios.post('http://localhost:5000/api/posts/like-post', {
                userId,
                postId,
                liked: newLikeStatus,
            });

            // Confirm like count from server
            setLikedPosts(prev => ({
                ...prev,
                [postId]: { liked: newLikeStatus, count: response.data.likes },
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert if there's an error
            setLikedPosts(prev => ({
                ...prev,
                [postId]: { liked: isLiked, count: (prev[postId]?.count || 0) - (newLikeStatus ? 1 : -1) }
            }));
        }
    };

    return (
        <LikeContext.Provider value={{ likedPosts, toggleLike }}>
            {children}
        </LikeContext.Provider>
    );
};

// Custom hook to use LikeContext
export const useLike = () => useContext(LikeContext);
