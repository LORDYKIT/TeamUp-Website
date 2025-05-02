
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // State for the current logged-in user
  const [user, setUser] = useState({
    username: 'defaultUser',
    fullName: 'John Doe',
    profilePic: '/defaultProfile.png',
    biography: "Hello, I'm new to TeamUp!",
  });

  // State for the list of users
  const [users, setUsers] = useState([]);

  // Fetch users from MongoDB backend on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users'); // Adjust endpoint if necessary
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
