// import React, { createContext, useContext, useEffect, useState } from 'react';

// const FollowContext = createContext();

// export const FollowProvider = ({ children }) => {
//     const [followersData, setFollowersData] = useState({});
//     const [followingData, setFollowingData] = useState({});

//     useEffect(() => {
//         // Load followers and following from local storage
//         const storedFollowersData = JSON.parse(localStorage.getItem('followersData')) || {};
//         const storedFollowingData = JSON.parse(localStorage.getItem('followingData')) || {};
//         setFollowersData(storedFollowersData);
//         setFollowingData(storedFollowingData);
//     }, []);

//     const toggleFollow = (currentUsername, targetUsername) => {
//         setFollowersData(prevFollowersData => {
//             const isFollowing = prevFollowersData[targetUsername]?.includes(currentUsername);

//             const updatedFollowers = isFollowing
//                 ? prevFollowersData[targetUsername].filter(follower => follower !== currentUsername) // Unfollow
//                 : [...(prevFollowersData[targetUsername] || []), currentUsername]; // Follow

//             const updatedFollowersData = {
//                 ...prevFollowersData,
//                 [targetUsername]: updatedFollowers,
//             };

//             localStorage.setItem('followersData', JSON.stringify(updatedFollowersData));
//             return updatedFollowersData;
//         });

//         setFollowingData(prevFollowingData => {
//             const isFollowing = prevFollowingData[currentUsername]?.includes(targetUsername);

//             const updatedFollowing = isFollowing
//                 ? prevFollowingData[currentUsername].filter(f => f !== targetUsername) // Unfollow
//                 : [...(prevFollowingData[currentUsername] || []), targetUsername]; // Follow

//             const updatedFollowingData = {
//                 ...prevFollowingData,
//                 [currentUsername]: updatedFollowing,
//             };

//             localStorage.setItem('followingData', JSON.stringify(updatedFollowingData));
//             return updatedFollowingData;
//         });
//     };

//     const resetFollowers = () => {
//         setFollowersData({});
//         setFollowingData({});
//         localStorage.setItem('followersData', JSON.stringify({}));
//         localStorage.setItem('followingData', JSON.stringify({}));
//     };

//     return (
//         <FollowContext.Provider value={{ followersData, followingData, toggleFollow, resetFollowers }}>
//             {children}
//         </FollowContext.Provider>
//     );
// };

// export const useFollow = () => useContext(FollowContext);

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const FollowContext = createContext();

export const FollowProvider = ({ children, username, id }) => {
    const [followersData, setFollowersData] = useState({});
const [followingData, setFollowingData] = useState({});
const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const { user } = useUser();

    useEffect(() => {
        fetchData();
    }, [id]);

   
    const toggleFollow = async (currentID, targetID) => {
        try {
            // Call the API to toggle follow status in the database
            const response = await fetch(`http://localhost:5000/api/users/${currentID}/follow/${targetID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error("Failed to update follow status.");
            }
    
            const data = await response.json();
    
            // Update followers and following states with the API response data
            setFollowersData(prevFollowersData => ({
                ...prevFollowersData,
                [targetID]: data.updatedFollowers // Updated followers for target user
            }));
    
            setFollowingData(prevFollowingData => ({
                ...prevFollowingData,
                [currentID]: data.updatedFollowing // Updated following list for current user
            }));
            
        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };

    // Define fetchData as a separate function so it can be called externally
    const fetchData = async () => {
        try {
           
            if (!id) return; // Ensure user is defined before proceeding

            const followersResponse = await axios.get(`http://localhost:5000/api/users/${id}/followers`);
            const followingResponse = await axios.get(`http://localhost:5000/api/users/${id}/following`);

           

            setFollowersData(followersResponse.data);
            setFollowingData(followingResponse.data);
     
            const followCountResponse = await axios.get(`http://localhost:5000/api/users/${id}/follow-count`); // Fetch follow count

    
            // Set follow counts based on the response
            setFollowerCount(followCountResponse.data.followersCount);
            setFollowingCount(followCountResponse.data.followingCount);
        } catch (error) {
            console.error("Error fetching followers/following data:", error);
        }
    };


useEffect(() => {
    console.log("Followers Data:", followersData);
    console.log("Following Data:", followingData);
}, [followersData, followingData]);

    
    // Reset followers and following (e.g., when logging out)
    const resetFollowers = () => {
        setFollowersData({});
        setFollowingData({});
    };

    return (
        <FollowContext.Provider value={{ followersData, toggleFollow, followingData, resetFollowers, fetchData, followerCount, followingCount, setFollowerCount, setFollowingCount }}>
            {children}
        </FollowContext.Provider>
    );
};

export const useFollow = () => useContext(FollowContext);
