import { useEffect, useState } from "react";
import { Box, VStack, Flex, Image,Text,Skeleton, SkeletonCircle } from "@chakra-ui/react";
import SuggestedUser from "./SuggestedUser";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Assuming useUser is the custom hook for currentUser

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const { user } = useUser(); // Assuming useUser provides the current user object

    useEffect(() => {
        setLoading(true);

        const fetchSuggestedUsers = async () => {
            if (!user || !user._id) {
                console.error("User ID is not available.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/users/suggested-users/${user._id}`); // Pass currentUser._id as parameter
                
                // Filter out the current user just in case
                const filteredUsers = response.data.filter((suggestedUser) => suggestedUser._id !== user._id);

                setSuggestedUsers(filteredUsers);
            } catch (error) {
                console.error("Failed to fetch suggested users", error);
            } finally {
				setLoading(false);
			}

        };

        fetchSuggestedUsers();
    }, [user]); // Re-run the effect if user data changes

    return (
        <VStack spacing={4} align="start">
            <Text mb={4} fontWeight={"bold"} fontSize={19}>Suggested Users</Text>

            {/* Show skeletons when loading */}
            {loading ? (
                [0, 1, 2, 3, 4].map((_, idx) => (
                    <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
                        {/* avatar skeleton */}
                        <Box>
                            <SkeletonCircle size={"10"} />
                        </Box>
                        {/* username and fullname skeleton */}
                        <Flex w={"full"} flexDirection={"column"} gap={2}>
                            <Skeleton h={"8px"} w={"80px"} />
                            <Skeleton h={"8px"} w={"90px"} />
                        </Flex>
                        {/* follow button skeleton */}
                        <Flex>
                            <Skeleton h={"20px"} w={"60px"} />
                        </Flex>
                    </Flex>
                ))
            ) : (
                // Show suggested users when not loading
                Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
                    suggestedUsers.map((user) => (
                        <Box key={user._id} w="full">
                            <SuggestedUser 
                                username={user.username} 
                                profilePic={user.profilePicture} 
                                fullName={user.fullname} 
                                id={user._id}
                            />
                        </Box>
                    ))
                ) : (
                    <Flex direction="column" alignItems="center" justifyContent="center" h="100%" gap={4}>  {/* Add gap for spacing */}
                    <Image src="/Bean Eater@1x-1.0s-200px-200px.gif" alt="No results" boxSize="100px" />
                    <Text fontWeight="bold" fontSize="md">No suggested users...</Text> {/* Adjust font size if needed */}
                </Flex>
                )
            )}
        </VStack>
    );
};
export default SuggestedUsers;
