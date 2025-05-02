
import { 
	Flex, Box, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link 
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import userAtom from "../atoms/userAtom";


export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const setUserAtom = useSetRecoilState(userAtom);
	const { setUser } = useUser();
	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();

	const handleLogin = async () => {
		setLoading(true);
		const loginData = {
		  username: inputs.username,
		  password: inputs.password,
		};
	  
		try {
		  const response = await fetch('http://localhost:5000/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData),
		  });
	   
		  if (response.ok) {
			const data = await response.json(); // Parse the response body
			const { user, token } = data; // Destructure user and token
	  
			  setUser(user);
			  localStorage.setItem('user-threads', JSON.stringify(user));
			  localStorage.setItem('auth-token', token); // Save token securely
			  setUserAtom(user);
	  
			  console.log('Token:', token);
			  navigate(`/user/${user._id}`); // Navigate to user page
			  showToast('Success', 'Login successful', 'success');
			} else {
			const errorData = await response.json();
			showToast("Error", errorData.message || "Login failed", "error");
		  }
		
		} catch (error) {
		  console.error("Error during login:", error);
		  showToast("Error", "An error occurred while logging in", "error");
		} finally {
		  setLoading(false);
		}
	  };
	  

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"} color="white" 
					fontFamily="'Playwrite DK Uloopet', sans-serif" >
						Login
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
                    backdropFilter="blur(5px)"

					// bg={"blackAlpha.100"}
					boxShadow={"lg"}
					p={8}
					w={{ base: "full", sm: "400px" }}
				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel color="white">Username</FormLabel>
							<Input
							   
								type="text"
								value={inputs.username}
								onChange={(e) =>
									setInputs((inputs) => ({
										...inputs,
										username: e.target.value,
									}))
								}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel color="white" >Password</FormLabel>
							<InputGroup >
								<Input
								
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) =>
										setInputs((inputs) => ({
											...inputs,
											password: e.target.value,
										}))
									}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword((prev) => !prev)
										}
									>
										{showPassword ? (
											<ViewIcon />
										) : (
											<ViewOffIcon />
										)}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={1} align={"center"}>
						<button
						className="button-auth"
						onClick={handleLogin}
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
						<span></span><span></span><span></span><span></span>
					</button>
						</Stack>
						<Stack pt={1}>
							<Text align={"center"} color="white" fontWeight="bold">
								Dont have an account?{" "}
								<Link
									color={"teal"}
									onClick={() => setAuthScreen("signup")}
								>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
